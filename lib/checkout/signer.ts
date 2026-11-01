/** Who signs checkout agreements for Hewn Life. Set HEWN_SIGNER_NAME / HEWN_SIGNER_TITLE in Vercel to sign in a person's name. */
export const hewnSigner = () => ({ name: process.env.HEWN_SIGNER_NAME || 'Hewn Life', title: process.env.HEWN_SIGNER_TITLE || 'Authorized signatory' })
