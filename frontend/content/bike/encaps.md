<h2>Eingabewerte</h2>
<p>Für die Kapselung wird der öffentliche Schlüssel $pk$ (der in BIKE einfach das Polynom $h$ ist) benötigt, der im <strong>KeyGen</strong>-Schritt erzeugt wurde.</p>

<p><strong>Öffentlicher Schlüssel `pk` (Base64):</strong></p>
<textarea class="key-input" rows="4" spellcheck="false" readonly>{{publicKey}}</textarea>

<button id="run-encaps-btn" class="btn-action" {{pk_disabled}}>Ciphertext & Schlüssel K generieren</button>

---

<h2>Erzeugung der ephemeren Geheimnisse</h2>
<p>Der Kapselungsprozess beginnt mit der Erzeugung von zwei geheimen Werten, die nur für diese eine Sitzung gültig sind.</p>
<ol>
    <li><strong>Zufällige Nachricht $m$:</strong> Eine zufällige Nachricht $m$ wird aus dem Nachrichtenraum $\mathcal{M} = \{0,1\}^l$ generiert. Diese Nachricht ist der "Keim" für den gemeinsamen geheimen Schlüssel.
        <ul><li><strong>Generierung:</strong> $m \leftarrow \mathcal{M}$</li></ul>
    </li>
    <li><strong>Fehlervektor $(e_0, e_1)$:</strong> Aus der Nachricht $m$ und einem Teil des öffentlichen Schlüssels $h$ wird mittels der Hash-Funktion $H$ ein Fehlervektor $(e_0, e_1)$ mit festem Hamming-Gewicht $t$ abgeleitet.
        <ul><li><strong>Ableitung:</strong> $(e_0, e_1) \leftarrow H(m, \pi_l(h))$</li></ul>
    </li>
</ol>

<details>
    <summary>Details</summary>
    <p>Der Fehlervektor $(e_0, e_1)$ gehört zur Menge $\mathcal{E}_t = \{ (e_0, e_1) \in \mathcal{R}^2 \mid |e_0| + |e_1| = t \}$. Das Gesamtgewicht beider Polynome muss also exakt $t$ betragen.</p>
    <p>Die Funktion $H$ wird als Zufallsorakel modelliert. Die Einbeziehung von $\pi_l(h)$ (die ersten $l$ Bits von $h$) in den Hash-Input ist eine wichtige Sicherheitsmaßnahme. Sie bindet den erzeugten Fehlervektor an den spezifischen öffentlichen Schlüssel und verhindert "Multi-Target-Angriffe", bei denen ein Angreifer einen Fehlervektor für viele verschiedene öffentliche Schlüssel wiederverwenden könnte.</p>
</details>

---

<h2>Berechnung des Chiffrats $c = (c_0, c_1)$</h2>
<p>Das Chiffrat $c$ besteht aus zwei Komponenten, $c_0$ und $c_1$.</p>
<ul>
    <li><strong>Berechnung von $c_0$ (Syndrom):</strong> $c_0 \leftarrow e_0 + e_1 h$</li>
    <li><strong>Berechnung von $c_1$ (maskierte Nachricht):</strong> $c_1 \leftarrow m \oplus L(e_0, e_1)$</li>
</ul>

<details>
    <summary>Mathematischer Hintergrund</summary>
    <ul>
        <li>$c_0$ ist das <strong>Syndrom</strong> des Fehlervektors $(e_0, e_1)$. Es wird durch Polynomaddition und -multiplikation im Ring $\mathcal{R}$ berechnet. $c_0$ enthält die Information über den Fehler, aber nicht den Fehler selbst. Der Empfänger wird seinen privaten Schlüssel $(h_0, h_1)$ verwenden, um aus $c_0$ den ursprünglichen Fehler $(e_0, e_1)$ zu dekodieren.</li>
        <li>$c_1$ ist die <strong>maskierte Nachricht</strong>. Die ursprüngliche Nachricht $m$ wird mit dem Ergebnis der Hash-Funktion $L(e_0, e_1)$ XOR-verknüpft. Dies funktioniert wie ein One-Time-Pad. Nur wer $(e_0, e_1)$ kennt (oder aus $c_0$ rekonstruieren kann), kann die Maskierung entfernen und $m$ wiederherstellen.</li>
    </ul>
</details>

<p><strong>Chiffrat `ct` (Base64):</strong></p>
<textarea class="key-input" rows="4" spellcheck="false" readonly>{{ciphertext}}</textarea>

---

<h2>Ableitung des gemeinsamen Schlüssels $K$</h2>
<p>Der finale gemeinsame geheime Schlüssel $K$ wird aus der ursprünglichen Nachricht $m$ und dem vollständigen Chiffrat $c$ abgeleitet.</p>
<ul>
    <li><strong>Ableitung:</strong> $K \leftarrow K(m, c)$</li>
</ul>

<details>
    <summary>Zweck</summary>
    <p>Dieser letzte Hashing-Schritt stellt sicher, dass der gemeinsame Schlüssel $K$ von der gesamten Transaktion (Nachricht $m$ und Chiffrat $c$) abhängt. Dies ist Teil der Fujisaki-Okamoto-Transformation, die verwendet wird, um IND-CCA-Sicherheit zu erreichen.</p>
</details>

<p><strong>Gemeinsamer geheimer Schlüssel $K$ (Base64):</strong></p>
<textarea class="key-input" rows="2" spellcheck="false" readonly>{{sharedSecret}}</textarea>
