import Image from 'next/image';

const logos = [
  { name: 'V12 — Horizon', file: 'logo-v12-horizon.svg', desc: 'Half sun rising/setting on the horizon between the 6s.' },
  { name: 'V13 — Badge', file: 'logo-v13-badge.svg', desc: 'Circular badge with warm inner glow.' },
  { name: 'V14 — Minimal', file: 'logo-v14-minimal.svg', desc: 'Light weight with thin connecting lines.' },
  { name: 'V15 — Gradient', file: 'logo-v15-gradient.svg', desc: 'Sunrise-to-sunset color gradient across the text.' },
  { name: 'V16 — Stacked', file: 'logo-v16-stacked.svg', desc: 'Vertical layout — sunrise 6 on top, sunset 6 on bottom.' },
];

export default function LogosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 p-10">
      <h1 className="text-3xl font-bold text-amber-900 text-center mb-10">6 to 6 — Logo Variations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {logos.map((logo) => (
          <div key={logo.file} className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-4">{logo.name}</h3>
            <div className="flex justify-center mb-4">
              <Image src={`/${logo.file}`} alt={logo.name} width={150} height={150} className="h-auto" />
            </div>
            <p className="text-sm text-stone-500">{logo.desc}</p>

            {/* Dark mode preview */}
            <div className="mt-4 bg-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-2">Dark mode</p>
              <Image src={`/${logo.file}`} alt={logo.name} width={120} height={120} className="h-auto mx-auto brightness-110" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
