<h2>Initialer Seed</h2>
<p>Die gesamte Schlüsselgenerierung bei Classic McEliece ist deterministisch und basiert auf einem einzigen, zufälligen Seed $\delta$ der Länge $l=256$ Bit. Aus diesem Seed werden alle Komponenten des Schlüsselpaars abgeleitet.</p>

<button id="run-keygen-btn" class="btn-action">Schlüsselpaar generieren</button>

<p><strong>Initialer Seed $\delta$ (wird vom Backend zufällig erzeugt):</strong></p>
<textarea class="key-input" rows="2" spellcheck="false" readonly>{{secretKey}}</textarea>
<p class="feedback-msg"><i>Hinweis: Bei Classic McEliece ist der private Schlüssel `sk` eine komplexe Struktur. Der hier gezeigte Base64-String repräsentiert den gesamten privaten Schlüssel, dessen erster Teil der Seed $\delta$ ist.</i></p>

---

<h2>Seed-Expansion & Goppa-Code-Konstruktion</h2>
<p>Der Seed $\delta$ wird mittels des Pseudozufallsgenerators $G$ (SHAKE256) zu einem langen String $E$ expandiert. Aus diesem String werden deterministisch die definierenden Elemente des Goppa-Codes erzeugt:</p>
<ol>
    <li><strong>Goppa-Polynom $g(x)$:</strong> Ein irreduzibles Polynom vom Grad $t$ über dem Körper $\mathbb{F}_{2^m}$.</li>
    <li><strong>Stützstellen $\alpha_i$:</strong> Eine geordnete Liste von $n$ verschiedenen Elementen aus $\mathbb{F}_{2^m}$.</li>
</ol>
<p>Diese beiden Komponenten bilden die geheime algebraische Struktur $\Gamma = (g(x), \alpha_0, \dots, \alpha_{n-1})$, die das Herzstück des privaten Schlüssels ist.</p>

<details>
    <summary>Deterministische Erzeugung </summary>
    <p>Der expandierte String $E = G(\delta)$ wird in Abschnitte unterteilt. Ein Abschnitt dient als Input für den `IRREDUCIBLE`-Algorithmus, um $g(x)$ zu finden. Ein anderer Abschnitt dient als Input für den `FIELDORDERING`-Algorithmus, um die Reihenfolge der Stützstellen $\alpha_i$ festzulegen. Schlägt einer dieser Schritte fehl (z.B. weil das erzeugte Polynom nicht irreduzibel ist), wird ein neuer Seed $\delta'$ vom Ende von $E$ genommen und der Prozess wiederholt. Dies garantiert, dass am Ende immer ein gültiges Schlüsselpaar entsteht.</p>
</details>

---

<h2>Verschleierung: Die öffentliche Matrix $T$</h2>
<p>Dies ist der entscheidende Schritt, um die Struktur des Goppa-Codes zu verbergen. Aus der geheimen Struktur $\Gamma$ wird die öffentliche Matrix $T$ erzeugt.</p>
<ol>
    <li><strong>Konstruktion der Parity-Check-Matrix $\hat{H}$:</strong> Aus $g(x)$ und den $\alpha_i$ wird eine hochstrukturierte $mt \times n$ Parity-Check-Matrix $\hat{H}$ über $\mathbb{F}_2$ konstruiert.</li>
    <li><strong>Systematisierung:</strong> $\hat{H}$ wird mittels Gauß-Elimination in eine systematische Form gebracht:
        $$ \hat{H} \xrightarrow{\text{Gauß}} H_{sys} = (I_{mt} | T) $$
        wobei $I_{mt}$ die $mt \times mt$ Einheitsmatrix ist.
    </li>
</ol>
<p>Die resultierende $mt \times k$ Matrix $T$ ist der öffentliche Schlüssel. Für einen Angreifer sieht $T$ wie eine zufällige Matrix aus, und es ist rechentechnisch unmöglich, aus ihr die geheime Goppa-Struktur $\Gamma$ zurückzugewinnen.</p>

<p><strong>Öffentlicher Schlüssel `pk` (Base64):</strong></p>
<textarea class="key-input" rows="8" spellcheck="false" readonly>{{publicKey}}</textarea>

---

<h2>Vervollständigung des privaten Schlüssels</h2>
<p>Der vollständige private Schlüssel `sk` enthält alle Informationen, die zur effizienten Dekodierung benötigt werden:</p>
<ul>
    <li>Der initiale Seed $\delta$.</li>
    <li>Das Goppa-Polynom $g(x)$.</li>
    <li>Die (ggf. permutierte) Liste der Stützstellen $a$.</li>
    <li>Ein zufälliger Vektor $s$ (ebenfalls aus $E$ abgeleitet) für die IND-CCA-Sicherheit.</li>
    <li>Informationen über Spaltenswaps $c$ (nur bei "f"-Varianten relevant).</li>
</ul>
<p>Alle diese Komponenten werden zusammengefasst und als ein einziger Base64-String gespeichert, der den `secretKey` darstellt.</p>
