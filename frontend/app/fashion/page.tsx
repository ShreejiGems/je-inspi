import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';

export const metadata: Metadata = {
  title: 'Fashion | JE-Inspi',
  description: 'Discover a new chapter in personal style. The JE-Inspi fashion collection is coming soon.',
};

export default function FashionPage() {
  return <div className="bg-brand-50 text-brand-900">
    <Navbar />
    <main>
      <section className="grid md:grid-cols-2 min-h-[70vh] max-w-[1600px] mx-auto">
        <div className="flex flex-col justify-center items-start px-6 py-16 md:p-16 lg:p-24">
          <p className="uppercase tracking-[0.25em] text-sm text-brand-600 mb-6">JE-Inspi · Fashion</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">A new chapter<br />in personal style.</h1>
          <p className="text-xl leading-relaxed max-w-md mb-8">An expression of who you are, in every detail.</p>
          <span className="rounded-full border border-brand-300 px-4 py-2 text-sm mb-5">Collection coming soon</span>
          <p className="text-brand-700 max-w-md leading-relaxed mb-8">Our fashion collection is on its way. Get in touch to learn more about what’s next at JE-Inspi.</p>
          <Link href="/contact-us" className="inline-flex items-center gap-6 bg-brand-600 text-white px-7 py-3 rounded hover:bg-brand-700 transition-colors">Enquire about fashion <span aria-hidden="true">→</span></Link>
          <nav aria-label="Explore more collections" className="flex flex-wrap gap-6 mt-10 text-brand-700">
            <Link href="/jewellery" className="underline underline-offset-4">Explore jewellery</Link>
            <Link href="/diamond" className="underline underline-offset-4">Explore diamonds</Link>
          </nav>
        </div>
        <div className="relative min-h-[500px] md:min-h-[700px]">
          <Image src="/assets/home/collection/Modal Fourth Image.jpg" alt="Embroidered occasionwear styled with statement jewellery"
            fill priority sizes="(max-width: 767px) 100vw, 50vw" className="object-cover object-top" />
        </div>
      </section>
    </main>
    <Footer />
  </div>;
}
