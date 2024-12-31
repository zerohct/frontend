import React from "react";
import Header from "components/common/Header";
import Footer from "components/common/Footer";
import ContactForm from "components/contact/ContactForm";

const Contact = () => {
    return (
        <div className="flex flex-col min-h-screen">
        <Header></Header>
        <ContactForm />
        <Footer />
      </div>
    );
};

export default Contact;