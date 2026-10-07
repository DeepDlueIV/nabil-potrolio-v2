const navigation = [
  ['About', '#about'],
  ['Expertise', '#expertise'],
  ['Architecture', '#architecture'],
  ['Experience', '#experience'],
  ['Technology', '#technology'],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-mark" href="#top" aria-label="Nabil Rakdani, back to top">
        NR<span aria-hidden="true">/</span>
      </a>
      <nav aria-label="Primary navigation">
        {navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <div className="site-header__actions">
        <a className="header-contact" href="#contact">Start a conversation <span aria-hidden="true">↗</span></a>
      </div>
    </header>
  );
}
