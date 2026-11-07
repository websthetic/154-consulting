/*
 * The case study scene: the brief, the mark set out and traced, filled, its
 * variants, its system, then the live work. Built at build time so the page
 * arrives whole; assets/js/modules/caseStory.js only animates it.
 *
 * Drawing data comes from _data/marks.json, keyed by the case's `key`.
 * Usage: {% caseStory key, name, palette, story, marks %}
 */
module.exports = function caseStory(key, name, palette, S, marks) {
    const D = marks[key];
    if (!S || !D) return "";
    const M = D.mark;
    const vb = M.vb, VX = vb[0], VY = vb[1], VW = vb[2], VH = vb[3];
    const conW = (VW / 520).toFixed(3), outW = (VW / 170).toFixed(3);
    const words = D.words;

    // the set-out: supplied where it was drawn by hand, derived from the box otherwise
    const lines = D.con || [
        ["h", VY + VH * 0.055], ["h", VY + VH * 0.945], ["h", VY + VH * 0.5],
        ["v", VX + VW * 0.5], ["v", VX + VW * 0.14], ["v", VX + VW * 0.86],
        ["r", VX + VW * 0.08, VY + VH * 0.055, VW * 0.84, VH * 0.89],
    ];
    const con = lines.map((l) => {
        const a = 'class="kc" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"';
        if (l[0] === "h") return "<path " + a + ' d="M' + (VX - VW * 0.04) + " " + l[1] + " H" + (VX + VW * 1.04) + '"/>';
        if (l[0] === "v") return "<path " + a + ' d="M' + l[1] + " " + (VY - VH * 0.04) + " V" + (VY + VH * 1.04) + '"/>';
        return "<rect " + a + ' x="' + l[1] + '" y="' + l[2] + '" width="' + l[3] + '" height="' + l[4] + '"/>';
    }).join("");

    const outs = M.d.map((d) => '<path class="ko" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" d="' + d + '"/>').join("");
    const fills = '<path class="kf" opacity="0" fill-rule="evenodd" d="' + M.d.join(" ") + '"/>';
    const wordm = (M.w || []).map((d) => '<path class="kw" opacity="0" d="' + d + '"/>').join("");
    const g = M.tf ? ' transform="' + M.tf + '"' : "";

    const AL = D.alts;
    const cols = AL.length <= 2 ? AL.length : AL.length === 4 ? 4 : AL.length > 5 ? 4 : 3;
    const alts = !AL.length ? "" :
        '<div class="kl kl--alts" data-r="alts"><div class="ka__grid" style="--kacols:' + cols + '">' +
        AL.map((a, i) => {
            const ad = a.d || M.d;
            const avb = a.vb || M.vb;
            const atf = a.tf !== undefined ? a.tf : M.tf || "";
            const ag = atf ? ' transform="' + atf + '"' : "";
            const ow = (avb[2] / 150).toFixed(3);
            const traced = !a.ref && ad.length <= 60;
            return '<figure class="ka" data-i="' + i + '"' + (a.bg ? ' style="--kabg:' + a.bg + '"' : "") + ">" +
                '<svg viewBox="0 0 ' + avb[2] + " " + avb[3] + '" role="img" aria-label="' + a.n + '">' +
                (traced ? "<g" + ag + ' fill="none" stroke="#8A5C13" stroke-width="' + ow + '" stroke-linejoin="round">' +
                    ad.map((d) => '<path class="kao" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" d="' + d + '"/>').join("") +
                    "</g>" : "") +
                "<g" + ag + ' fill="' + (a.tint || "#1B1A17") + '">' +
                '<path class="kaf" opacity="0" fill-rule="evenodd" d="' + ad.join(" ") + '"/>' +
                "</g>" +
                "</svg><figcaption>" + a.n + "</figcaption></figure>";
        }).join("") + "</div></div>";

    const brief = S.before
        ? '<div class="kl kl--shot" data-r="before"><img src="' + S.before + '" alt="What ' + name + ' had before." loading="lazy"></div>' +
          '<div class="kl__ring" data-r="ring"></div><div class="kl__note" data-r="note">' + (S.note || "") + "</div>"
        : '<div class="kl kl--quote" data-r="before"><p class="kl__said">' + S.quote.text + "</p>" +
          '<span class="kl__who">' + S.quote.who + "</span></div>";

    return '<div class="cs cs--story" id="cs-' + key + '" data-k="' + key + '"' +
        (D.tr ? " data-tr='" + JSON.stringify(D.tr) + "'" : "") + ">" +
        '<div class="cs__stick">' +
        '<div class="cs__caps">' + S.caps.map((t, i) => '<p class="cs__cap" data-at="' + i + '">' + t + "</p>").join("") + "</div>" +
        '<div class="cs__stage">' +
        words.map((w, i) => '<span class="cs__ghost" data-at="' + i + '">' + w + "</span>").join("") +
        brief +
        '<div class="kl kl--draw" data-r="mark">' +
        '<svg class="kl__svg" viewBox="' + vb.join(" ") + '" role="img" aria-label="The ' + name + ' mark, set out and drawn.">' +
        '<g data-r="con" stroke="#9A9486" stroke-width="' + conW + '" fill="none" opacity="0">' + con + "</g>" +
        '<g data-r="out"' + g + ' fill="none" stroke="#8A5C13" stroke-width="' + outW + '" stroke-linejoin="round">' + outs + "</g>" +
        '<g data-r="fill"' + g + ' fill="#1B1A17">' + fills + "</g>" +
        (wordm ? '<g data-r="word" fill="#1B1A17">' + wordm + "</g>" : "") +
        "</svg>" +
        (S.name ? '<span class="kl__name" data-r="name">' + S.name + "</span>" : "") +
        "</div>" +
        alts +
        '<div class="kl kl--sys" data-r="sys">' +
        '<div class="cs__pal">' + (palette || []).map((x) => '<i style="background:' + x + '"></i>').join("") + "</div>" +
        '<div class="cs__meta">' + (S.type || []).map((t) => "<span>" + t.role + " <b>" + t.face + "</b></span>").join("") + "</div>" +
        "</div>" +
        '<div class="kl kl--shot" data-r="live"><img src="' + S.live + '" alt="' + name + ', the finished work." loading="lazy"></div>' +
        "</div>" +
        "</div></div>";
};
