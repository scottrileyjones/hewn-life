import { ClosePanel } from './strata/Page'

interface CtaBannerProps {
  headline?: string
  body?: string
  buttonText?: string
}

export default function CtaBanner({ headline, body, buttonText }: CtaBannerProps) {
  return <ClosePanel title={headline} body={body} buttonText={buttonText} secondary={{ href: '/pricing', label: 'See plans & pricing' }} />
}
