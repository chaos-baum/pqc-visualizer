<h2>Grundlagen und Sicherheitslevel</h2>
<p>BIKE (Bit Flipping Key Encapsulation) ist ein KEM, das auf der Schwierigkeit des Dekodierens von QC-MDPC-Codes (Quasi-Cyclic Moderate-Density Parity-Check) beruht. Seine Stärken liegen in den sehr kleinen Schlüsseln und der hohen Performance, die durch die Verwendung eines einfachen, aber effektiven iterativen Dekodierungsalgorithmus, dem "Bit-Flipping", erreicht wird.</p>

<p>Wählen Sie ein Sicherheitslevel aus, um die zugehörigen Parameter zu laden:</p>
{{level_selector_html}}

---

<h2>2. Aktive Systemparameter</h2>
<p>Die folgenden Parameter definieren die Instanz des Kryptosystems und basieren auf Tabelle 4 der Spezifikation.</p>

<table class="param-table">
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Symbol</th>
            <th>Wert</th>
            <th>Beschreibung</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Aktives Level</td>
            <td>-</td>
            <td><code>{{set_name}}</code></td>
            <td>Der Name des Parametersatzes laut Spezifikation.</td>
        </tr>
        <tr>
            <td>Blocklänge</td>
            <td>$r$</td>
            <td><code>{{r}}</code></td>
            <td>Die Länge der Polynomblöcke im zugrundeliegenden Ring.</td>
        </tr>
        <tr>
            <td>Zeilengewicht</td>
            <td>$w$</td>
            <td><code>{{w}}</code></td>
            <td>Das Hamming-Gewicht der Zeilen in der Parity-Check-Matrix.</td>
        </tr>
        <tr>
            <td>Fehlergewicht</td>
            <td>$t$</td>
            <td><code>{{t}}</code></td>
            <td>Das Hamming-Gewicht des Fehlervektors.</td>
        </tr>
        <tr>
            <td>Secret Size</td>
            <td>$l$</td>
            <td><code>{{l}}</code></td>
            <td>Die Bitlänge des gemeinsamen geheimen Schlüssels.</td>
        </tr>
    </tbody>
</table>

---

<h2>Mathematische Grundlage: Der Polynomring</h2>
<p>Alle Operationen von BIKE finden, ähnlich wie bei HQC, in einem Polynomring statt.</p>
<ul>
    <li><strong>Definition:</strong> Der Ring wird definiert als $\mathcal{R} = \mathbb{F}_2[X]/(X^r - 1)$.</li>
    <li><strong>Bedeutung:</strong> Dieser Ring besteht aus Polynomen mit Koeffizienten in $\mathbb{F}_2$ (0 oder 1). Alle Berechnungen finden **modulo** $X^r - 1$ statt. Die Wahl von $r$ als Primzahl, für die 2 eine primitive Wurzel ist, verhindert algebraische Schwachstellen und stellt sicher, dass Polynome mit ungeradem Gewicht invertierbar sind.</li>
</ul>

---

<h2>Kryptographische Funktionen</h2>
<p>Das Setup definiert drei wesentliche Hash-Funktionen, die als Zufallsorakel modelliert werden (Spezifikation 2.5).</p>
<ul>
    <li>$H: \mathcal{M} \times \mathcal{M} \rightarrow \mathcal{E}_t$</li>
    <li>$K: \mathcal{M} \times \mathcal{R} \times \mathcal{M} \rightarrow \mathcal{K}$</li>
    <li>$L: \mathcal{R}^2 \rightarrow \mathcal{M}$</li>
</ul>
<details>
    <summary>Zweck der Funktionen</summary>
    <ul>
        <li><strong>Funktion H:</strong> Erzeugt aus einer Nachricht und einem Teil des öffentlichen Schlüssels den Fehlervektor $(e_0, e_1)$. In der Praxis wird dies durch einen pseudozufälligen Expander (basierend auf SHAKE256) realisiert.</li>
        <li><strong>Funktion K:</strong> Leitet den finalen gemeinsamen Schlüssel $K$ aus einer Nachricht und dem Chiffrat ab. Sie wird mit `SHA3-384` instanziiert.</li>
        <li><strong>Funktion L:</strong> Dient zur Maskierung der Nachricht im Chiffrat. Sie wird ebenfalls mit `SHA3-384` instanziiert.</li>
    </ul>
</details>

---

<h2>Decoder</h2>
<p>Ein zentraler Bestandteil von BIKE ist der iterative Bit-Flipping-Decoder.</p>
<ul>
    <li><strong>Algorithmus:</strong> BIKE-Flip (siehe Algorithmus 1 der Spezifikation)</li>
    <li><strong>Parameter:</strong> `NbIter` (Anzahl der Iterationen) und `threshold` (Schwellenwertfunktion).</li>
</ul>
<details>
    <summary>Decoder und Fehlerrate</summary>
    <p>Der Decoder versucht, aus einem Syndrom $s$ den ursprünglichen Fehlervektor $e$ zu rekonstruieren. Die Effizienz und Genauigkeit dieses Prozesses sind kritisch.</p>
    <p>Die <strong>Decoding Failure Rate (DFR)</strong> gibt die Wahrscheinlichkeit an, mit der der Decoder versagt. Für eine IND-CCA-sichere KEM muss die DFR extrem niedrig sein (z.B. $ < 2^{-128}$ für Level 1). Eine zu hohe DFR könnte für Angriffe ausgenutzt werden.</p>
</details>
