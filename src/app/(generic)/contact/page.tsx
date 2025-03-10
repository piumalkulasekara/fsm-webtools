  
import { ContactForm } from "@/components/(models)/contact-form";

export default function ContactPage() {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Contact Me</h1>
        {/* Render the contact form */}
        <div className="max-w-xl">
          <ContactForm />
        </div>
      </div>
    );
  }

  