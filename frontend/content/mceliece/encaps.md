<h2>Eingabewerte</h2>
<p>Für die Kapselung wird der öffentliche Schlüssel $pk$ (die Matrix $T$) benötigt, der im <strong>KeyGen</strong>-Schritt erzeugt wurde.</p>

<p><strong>Öffentlicher Schlüssel `pk` (Base64):</strong></p>
<textarea class="key-input" rows="8" spellcheck="false" readonly>{{publicKey}}</textarea>

<button id="run-encaps-btn" class="btn-action" {{pk_disabled}}>Ciphertext & Schlüssel K generieren</button>

---

<h2>Generierung des Fehlervektors $e$</h2>
<p>Der erste und wichtigste Schritt der Kapselung ist die Erzeugung eines zufälligen <strong>Fehlervektors</strong> $e$. Dieser Vektor ist der ephemere, geheime Wert für diese eine Sitzung.</p>
<ul>
    <li><strong>Generierung:</strong> $e \leftarrow \text{FIXEDWEIGHT}()$</li>
</ul>
<p>Der Vektor $e \in \mathbb{F}_2^n$ wird so erzeugt, dass er exakt das im Setup definierte Hamming-Gewicht $t$ hat. Das bedeutet, er hat genau $t$ Einsen an zufälligen Positionen und sonst nur Nullen.</p>

<details>
    <summary>Der `FIXEDWEIGHT`-Algorithmus </summary>
    <p>Dieser Algorithmus erzeugt einen zufälligen Vektor $e \in \mathbb{F}_2^n$ mit Hamming-Gewicht $|e| = t$. Dies geschieht, indem $t$ eindeutige, zufällige Indizes im Bereich $\{0, 1, \dots, n-1\}$ ausgewählt werden. An diesen Indexpunkten wird der Vektor $e$ auf 1 gesetzt, an allen anderen auf 0.</p>
    <p>Der Vektor $e$ ist die zentrale geheime Information dieser Kapselungs-Instanz. Nur wer $e$ kennt oder rekonstruieren kann, kann den gemeinsamen Schlüssel $K$ ableiten.</p>
</details>

<p class="feedback-msg"><i>Hinweis: Der Fehlervektor $e$ ist geheim und wird vom Backend nicht an das Frontend übermittelt.</i></p>

---

<h2>Berechnung des Chiffrats $C$</h2>
<p>Das Chiffrat $C$ wird durch Kodierung des Fehlervektors $e$ mit dem öffentlichen Schlüssel $T$ erzeugt. Dies ist im Wesentlichen eine Matrix-Vektor-Multiplikation.</p>
<ul>
    <li><strong>Berechnung:</strong> $C \leftarrow \text{ENCODE}(e, T)$</li>
</ul>
<p>Mathematisch wird dabei die öffentliche Parity-Check-Matrix $H_{sys} = (I_{mt} | T)$ mit dem Fehlervektor $e$ multipliziert:</p>
$$ C = H_{sys} \cdot e $$
<p>Das Ergebnis $C$ ist ein Vektor der Länge $mt$ und wird als <strong>Syndrom</strong> des Fehlervektors $e$ bezeichnet.</p>

<details>
    <summary>Das Syndrom-Dekodierungs-Problem</summary>
    <p>Aus der Perspektive eines Angreifers ist es rechentechnisch unmöglich, aus dem öffentlichen Syndrom $C$ und der öffentlichen Matrix $H_{sys}$ den ursprünglichen, dünn besetzten Fehlervektor $e$ zu finden. Dies ist die Essenz des Syndrom-Dekodierungs-Problems, auf dem die Sicherheit von McEliece beruht.</p>
</details>

<p><strong>Chiffrat `ct` (Base64):</strong></p>
<textarea class="key-input" rows="4" spellcheck="false" readonly>{{ciphertext}}</textarea>

---

<h2>Ableitung des gemeinsamen Schlüssels $K$</h2>
<p>Der finale gemeinsame geheime Schlüssel $K$ wird durch Hashing des geheimen Fehlervektors $e$ und des öffentlichen Chiffrats $C$ abgeleitet.</p>
<ul>
    <li><strong>Ableitung:</strong> $K \leftarrow H(1, e, C)$</li>
</ul>

<details>
    <summary>Sicherheitsaspekt </summary>
    <p>Die Hash-Funktion $H$ (SHAKE256) wird mit einem Präfix (hier das Byte `0x01` zur Domain Separation), dem Fehlervektor $e$ und dem Chiffrat $C$ aufgerufen:
    $$ K = H(\text{0x01} \ || \ e \ || \ C) $$
    Dieser Schritt bindet den Schlüssel $K$ kryptographisch an den geheimen Wert $e$ und den öffentlichen Wert $C$. Dies ist Teil der Fujisaki-Okamoto-Transformation, die aus einem IND-CPA-sicheren Public-Key-Encryption-Schema ein IND-CCA2-sicheres Key Encapsulation Mechanism macht.</p>
</details>

<p><strong>Gemeinsamer geheimer Schlüssel $K$ (Base64):</strong></p>
<textarea class="key-input" rows="2" spellcheck="false" readonly>{{sharedSecret}}</textarea>
