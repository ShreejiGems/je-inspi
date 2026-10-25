import dynamic from 'next/dynamic';
import ContactUs from '@/components/contact-us/contact-us';
import { garamond } from '@/src/common/helper';

const Navbar = dynamic(() => import('@/components/common/navbar'), { ssr: true });
const Footer = dynamic(() => import('@/components/common/footer'), { ssr: true });

export default function ContactUsPage() {
  return (
    <div className={`min-h-screen flex flex-col ${garamond.className}`}>
      <Navbar />
      <main className="flex-grow">
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
}
