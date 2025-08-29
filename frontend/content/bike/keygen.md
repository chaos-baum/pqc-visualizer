<h2>Erzeugung des Schlüsselmaterials $(h_0, h_1)$</h2>
<p>Der erste Schritt ist die Erzeugung von zwei zufälligen, dünn besetzten Polynomen, $h_0$ und $h_1$. Diese bilden den Kern des privaten Schlüssels und die geheime "Falltür" des Systems.</p>

<button id="run-keygen-btn" class="btn-action">Schlüsselpaar generieren</button>

<ul>
    <li><strong>Generierung:</strong> $(h_0, h_1) \leftarrow \mathcal{H}_w$</li>
</ul>

<details>
    <summary>Details</summary>
    <p>Die Notation $(h_0, h_1) \leftarrow \mathcal{H}_w$ bedeutet, dass zwei Polynome aus dem Ring $\mathcal{R} = \mathbb{F}_2[X]/(X^r - 1)$ zufällig und gleichverteilt gewählt werden, unter der Bedingung, dass sie zur Menge $\mathcal{H}_w$ gehören.</p>
    <p>Die Menge $\mathcal{H}_w$ ist definiert als:
    $$ \mathcal{H}_w = \{ (h_0, h_1) \in \mathcal{R}^2 \mid |h_0| = |h_1| = w/2 \} $$
    Dabei bezeichnet $|h_i|$ das Hamming-Gewicht des Polynoms $h_i$. Jedes der beiden Polynome muss also exakt $w/2$ Koeffizienten haben, die `1` sind. Diese Eigenschaft macht die zugrundeliegenden QC-MDPC Codes (Quasi-Cyclic Moderate-Density Parity-Check) aus.</p>
</details>

---

<h2>Berechnung des öffentlichen Schlüssels $h$</h2>
<p>Der öffentliche Schlüssel $h$ wird direkt aus den privaten Polynomen $h_0$ und $h_1$ berechnet.</p>
<ul>
    <li><strong>Berechnung:</strong> $h \leftarrow h_1 h_0^{-1}$</li>
</ul>

<details>
    <summary>Mathematischer Hintergrund</summary>
    <p>Diese Berechnung ist eine Multiplikation von $h_1$ mit dem multiplikativen Inversen von $h_0$ im Polynomring $\mathcal{R}$. Die Existenz von $h_0^{-1}$ ist garantiert, da der Parameter $w/2$ im Setup als ungerade festgelegt wurde. Polynome mit ungeradem Hamming-Gewicht sind in diesem speziellen Ring immer invertierbar.</p>
    <p>Die Berechnung des Inversen ist ein kritischer und rechenintensiver Teil der Schlüsselgenerierung. Effiziente Algorithmen, ähnlich dem erweiterten euklidischen Algorithmus für Polynome, werden hierfür eingesetzt.</p>
</details>

<p><strong>Öffentlicher Schlüssel `pk` (Base64):</strong></p>
<textarea class="key-input" rows="4" spellcheck="false" readonly>{{publicKey}}</textarea>

---

<h2>Vervollständigung des privaten Schlüssels</h2>
<p>Zusätzlich zu $(h_0, h_1)$ enthält der private Schlüssel zwei weitere Komponenten, $\mu$ und $\sigma$, die für den IND-CCA-sicheren Dekapselungsmechanismus benötigt werden.</p>
<ul>
    <li><strong>Ableitung von $\mu$:</strong> $\mu \leftarrow \pi_l(h)$</li>
    <li><strong>Generierung von $\sigma$:</strong> $\sigma \leftarrow \mathcal{M}$</li>
</ul>

<details>
    <summary>Sicherheitsaspekt: IND-CCA</summary>
    <ul>
        <li>$\mu$ sind die ersten $l$ Bits des öffentlichen Schlüssels $h$. Die Funktion $\pi_l$ steht für diese Trunkierung (Abschneiden). $\mu$ wird bei der Dekapselung zur Verifizierung des Chiffrats benötigt.</li>
        <li>$\sigma$ ist ein zufällig gewählter Wert aus dem Nachrichtenraum $\mathcal{M} = \{0,1\}^l$. Er dient als Fallback-Wert, um im Falle eines Entkapselungsfehlers einen gültigen, aber zufälligen Schlüssel $K$ zu erzeugen und so Seitenkanalangriffe zu verhindern.</li>
    </ul>
</details>

<p><strong>Vollständiger privater Schlüssel `sk` (Base64):</strong></p>
<textarea class="key-input" rows="4" spellcheck="false" readonly>{{secretKey}}</textarea>
<p class="feedback-msg"><i>Hinweis: Der `secretKey` enthält die Verkettung von $(h_0, h_1, \mu, \sigma)$.</i></p>
