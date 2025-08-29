<h2>Erzeugung des privaten Schlüssels (sk)</h2>

<p>Der private Schlüssel ist nur dem Empfänger (Alice) bekannt und bildet die geheime "Falltür" wleche es ihr ermöglicht Chiffrate zu entschlüsseln. Er besteht aus zwei zufälligen dünn besetzten Polynomen $x$ und $y$.</p>

<button id="run-keygen-btn" class="btn-action">Schlüsselpaar generieren (Level: {{set_name}})</button>

<ul>
    <li><strong>Erzeugung:</strong> Zwei zufällige, dünn besetzte Polynome $x, y$ werden aus dem Ring $\mathcal{R}_w$ gewählt.</li>
    <li><strong>Bedingung:</strong> Beide Polynome müssen exakt das Hamming-Gewicht $w = {{w}}$ haben.</li>
</ul>

<details>
    <summary>Spezifikationsdetails</summary>
    <p>Die Notation $(x, y) \leftarrow \mathcal{R}_w \times \mathcal{R}_w$ bedeutet, dass zwei Polynome aus dem Ring $\mathcal{R} = \mathbb{F}_2[X]/(X^n - 1)$ zufällig und gleichverteilt gewählt werden, unter der Bedingung, dass sie zur Menge $\mathcal{R}_w$ gehören.</p>
    <p>Die Menge $\mathcal{R}_w$ ist definiert als:</p>
    $$ \mathcal{R}_w = \{ v \in \mathcal{R} \mid |v| = w \} $$
    <p>Dabei bezeichnet $|v|$ das Hamming-Gewicht des Polynoms $v$. Die geringe Anzahl von '1'-Koeffizienten in $x$ und $y$ ist die entscheidende Eigenschaft, die eine effiziente Entschlüsselung ermöglicht.</p>
</details>

---

<h2>Erzeugung des öffentlichen Schlüssels (pk)</h2>

<p>Der öffentliche Schlüssel wird so konstruiert dass er die Struktur der privaten Schlüsselkomponenten $x$ und $y$ verbirgt.</p>

<ul>
    <li><strong>Zufälliges dichtes Polynom $h$ wählen:</strong> Ein dicht besetztes Polynom wird zufällig aus dem Ring $\mathcal{R}$ gewählt.</li>
    <li><strong>Verschleierung berechnen:</strong> Die zweite Komponente des öffentlichen Schlüssels wird berechnet als:</li>
</ul>
$$ s = x + h \cdot y $$

<details>
    <summary>Das Prinzip der Verschleierung</summary>
    <p>Die Sicherheit dieses Schrittes beruht auf der Annahme, dass die Summe eines dünn besetzten und eines (pseudo-)zufälligen, dicht besetzten Polynoms ununterscheidbar von einem zufälligen, dichten Polynom ist.</p>
    <ul>
        <li>$x, y$ ist dünn besetzt (hat wenige '1'-Koeffizienten).</li>
        <li>$h$ ist dicht besetzt (hat viele '1'-Koeffizienten).</li>
        <li>Das Produkt $h \cdot y$ im Ring $\mathcal{R}$ resultiert in einem Polynom, das ebenfalls dicht und pseudozufällig aussieht.</li>
        <li>Die Addition von $x$ zu diesem Produkt verändert den Zufallscharakter kaum.</li>
    </ul>
    <p>Für einen Angreifer, der nur $h$ und $s$ kennt, ist es rechentechnisch sehr schwer die ursprünglichen dünn besetzten Polynome $x$ und $y$ zu rekonstruieren</p>
</details>

---

<h2>Ergebnis: Das Schlüsselpaar</h2>

<p>Das vollständige Schlüsselpaar besteht aus:</p>

<ul>
    <li><strong>Öffentlicher Schlüssel:</strong> $pk = (h, s)$</li>
    <li><strong>Privater Schlüssel:</strong> $sk = (x, y, \sigma)$ (wobei $\sigma$ ein geheimer Wert für die IND-CCA-Sicherheit ist)</li>
</ul>

<p><strong>Öffentlicher Schlüssel `pk` (Base64):</strong></p>
<textarea class="key-input" rows="4" spellcheck="false" readonly>{{publicKey}}</textarea>

<p><strong>Privater Schlüssel `sk` (Base64):</strong></p>
<textarea class="key-input" rows="4" spellcheck="false" readonly>{{secretKey}}</textarea>
