module.exports = {
    name: "154 Consulting",
    legalName: "15413133 Canada Inc.",
    email: "hello@154consulting.ca",
    phoneForTel: "+1-647-228-1284",
    phoneFormatted: "(647) 228-1284",
    address: {
        lineOne: "2290 Dixie Road",
        city: "Mississauga",
        state: "ON",
        country: "CA",
    },
    socials: {
        instagram: "https://www.instagram.com/154consulting",
    },
    //! Make sure you include the file protocol (e.g. https://) and that NO TRAILING SLASH is included
    domain: "https://154consulting.ca",
    // Passing the isProduction variable for use in HTML templates
    isProduction: process.env.ELEVENTY_ENV === "PROD",
};
