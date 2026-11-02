import Link from 'next/link';

export default function Brand() {
  return <Link className="brand" href="/" aria-label="Typeloria home">
    <img className="brand-logo" src="/brand/typeloria-logo.png" width={56} height={56} alt="" decoding="async"/>
    <span className="brand-wordmark">Typeloria</span>
  </Link>;
}
