/*
 * Structured data for every page, built from the page's own front matter so the
 * JSON-LD can never disagree with what the page says.
 * Rendered by layouts/base.html as one <script type="application/ld+json"> per entry.
 */
const SECTION = {
    "/work/": "Work",
    "/services/": "Services",
    "/process/": "Process",
    "/where-to-start/": "Where to start",
    "/about/": "About",
    "/faq/": "FAQ",
    "/contact/": "Contact",
};
const PILLAR = { brand: "Brand", web: "Web", growth: "Growth" };
const text = (s) => String(s || "").replace(/<br\s*\/?>/g, " ").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

function organization(c) {
    return {
        "@type": "ProfessionalService",
        "@id": c.domain + "/#organization",
        name: c.name,
        legalName: c.legalName,
        url: c.domain + "/",
        logo: c.domain + "/assets/images/site/logo-nav.webp",
        image: c.domain + "/assets/images/site/s-home.webp",
        email: c.email,
        telephone: c.phoneForTel,
        description: "Brand, web and growth studio for service businesses across Ontario. Identity to launch, one team, no handoffs.",
        address: {
            "@type": "PostalAddress",
            streetAddress: c.address.lineOne,
            addressLocality: c.address.city,
            addressRegion: c.address.state,
            addressCountry: c.address.country,
        },
        areaServed: { "@type": "AdministrativeArea", name: "Ontario" },
        founder: { "@id": c.domain + "/about/#justice-okeke" },
        sameAs: [c.socials.instagram],
    };
}

function breadcrumbs(data) {
    const c = data.client, url = data.page.url;
    if (url === "/") return null;
    const items = [["154 Consulting", "/"]];
    const section = Object.keys(SECTION).find((s) => url.indexOf(s) === 0);
    if (section) items.push([SECTION[section], section]);
    if (data.kind === "service" && data.pillar) items.push([PILLAR[data.pillar], "/services/" + data.pillar + "/"]);
    if (url !== section) items.push([data.name || text(data.title).split(" | ")[0], url]);
    return {
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it[0], item: c.domain + it[1] })),
    };
}

function faqPage(faq) {
    return {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: text(f.q), acceptedAnswer: { "@type": "Answer", text: text(f.a) } })),
    };
}

module.exports = {
    schema(data) {
        const c = data.client;
        if (!c || !data.page || data.eleventyExcludeFromCollections) return [];
        const url = c.domain + data.page.url;
        const org = { "@id": c.domain + "/#organization" };
        const out = [];

        switch (data.schemaType) {
            case "home":
                out.push(organization(c));
                out.push({ "@type": "WebSite", "@id": c.domain + "/#website", name: c.name, url: c.domain + "/", publisher: org, inLanguage: "en-CA" });
                break;
            case "about":
                out.push({ "@type": "AboutPage", url, name: text(data.title), about: org });
                out.push({
                    "@type": "Person",
                    "@id": c.domain + "/about/#justice-okeke",
                    name: "Justice Okeke",
                    jobTitle: "Founder",
                    worksFor: org,
                    image: c.domain + "/assets/images/site/mephoto.webp",
                    url,
                });
                break;
            case "contact":
                out.push(organization(c));
                out.push({ "@type": "ContactPage", url, name: text(data.title), about: org });
                break;
            case "collection":
                out.push({ "@type": "CollectionPage", url, name: text(data.title), description: data.description, publisher: org });
                break;
            case "case":
                out.push({
                    "@type": "CreativeWork",
                    url,
                    name: data.name,
                    headline: text(data.lead),
                    description: data.description,
                    image: c.domain + data.cover,
                    creator: org,
                    about: { "@type": "Organization", name: data.name },
                    keywords: (data.disciplines || []).join(", "),
                });
                break;
            case "service":
                out.push({
                    "@type": "Service",
                    url,
                    name: data.name,
                    serviceType: data.name,
                    description: data.description,
                    provider: org,
                    areaServed: { "@type": "AdministrativeArea", name: "Ontario" },
                });
                break;
        }
        if (data.faq && data.faq.length) out.push(faqPage(data.faq));
        const crumbs = breadcrumbs(data);
        if (crumbs) out.push(crumbs);
        return out.map((o) => Object.assign({ "@context": "https://schema.org" }, o));
    },
};
