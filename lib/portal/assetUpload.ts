/** Shared by the client and team asset routes: read an upload form, create the asset, attach its files. */
import { CATEGORY_IDS, UPLOAD_MAX_BYTES, attachFile, getAsset, saveAsset, type Asset, type AssetStatus, type Category } from './assets'

const BLOCKED = /\.(exe|bat|cmd|com|msi|sh|js|jar|scr|dll|app|dmg|apk)$/i

export class UploadError extends Error {}

export async function createFromForm(form: FormData, who: { clientEmail: string; source: 'Client' | 'Hewn'; addedBy: string; status: AssetStatus }): Promise<Asset> {
  const category = String(form.get('category') || '')
  if (!CATEGORY_IDS.includes(category)) throw new UploadError('Pick a section for this asset.')
  const link = String(form.get('link') || '').trim()
  if (link && !/^https?:\/\/\S+$/i.test(link)) throw new UploadError('Links need to start with https://')
  const text = String(form.get('text') || '').trim()
  const notes = String(form.get('notes') || '').trim()
  const files = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
  if (files.length > 10) throw new UploadError('Up to 10 files at a time.')
  for (const f of files) {
    if (f.size > UPLOAD_MAX_BYTES) throw new UploadError(`“${f.name}” is over 4 MB. For big files like video, paste a Drive, Dropbox or Frame.io link instead.`)
    if (BLOCKED.test(f.name)) throw new UploadError(`“${f.name}” isn’t a file type we accept.`)
  }
  if (!files.length && !link && !text) throw new UploadError('Add a file, a link or some text.')
  const title = String(form.get('title') || '').trim() || files[0]?.name || (link ? new URL(link).host : '') || `${category} note`
  const asset = await saveAsset(null, { ...who, title, category: category as Category, link, text, notes })
  for (const f of files) await attachFile(asset.id, { name: f.name, type: f.type, bytes: await f.arrayBuffer() })
  return files.length ? (await getAsset(asset.id)) ?? asset : asset
}
