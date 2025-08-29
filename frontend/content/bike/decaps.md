<h2>Eingabewerte</h2>
<p>Für die Entkapselung werden der vollständige private Schlüssel $sk$ und das Chiffrat $ct$ benötigt.</p>

<p><strong>Privater Schlüssel `sk` (Base64):</strong></p>
<textarea class="key-input" rows="4" spellcheck="false" readonly>{{secretKey}}</textarea>

<p><strong>Chiffrat `ct` (Base64):</strong></p>
<textarea class="key-input" rows="4" spellcheck="false" readonly>{{ciphertext}}</textarea>

<button id="run-decaps-btn" class="btn-action" {{decaps_disabled}}>Schlüssel K entkapseln</button>

---

<h2>Dekodierung des Fehlervektors $e'$</h2>
<p>Dies ist der Kern der Entkapselung. Der Decoder-Algorithmus versucht, den ursprünglichen Fehlervektor $(e_0, e_1)$ aus dem Syndrom $c_0$ und den privaten Polynomen $(h_0, h_1)$ zu rekonstruieren.</p>
<ul>
    <li><strong>Berechnung:</strong> $e' \leftarrow \text{decoder}(c_0h_0, h_0, h_1)$</li>
</ul>

<details>
    <summary>Mathematischer Hintergrund</summary>
    <p>Das Produkt $c_0h_0$ wird berechnet. Erinnern wir uns an die Kapselung: $c_0 = e_0 + e_1h$ und $h = h_1h_0^{-1}$.
    Somit ist:
    $$ c_0h_0 = (e_0 + e_1h_1h_0^{-1})h_0 = e_0h_0 + e_1h_1 $$
    Dies ist das Syndrom des ursprünglichen Fehlervektors in einer anderen Form. Der <code>decoder</code> (z.B. BIKE-Flip) ist ein iterativer Algorithmus, der darauf ausgelegt ist, aus diesem Syndrom einen Fehlervektor $e'=(e'_0, e'_1)$ mit dem geringstmöglichen Gewicht zu finden. Im Erfolgsfall ist $e'$ identisch mit dem ursprünglichen Fehlervektor $(e_0, e_1)$.</p>
    <p>Wenn der Decoder fehlschlägt, gibt er ein spezielles Fehlersymbol $\perp$ zurück (in der Praxis oft als Nullvektor implementiert).</p>
</details>

---

<h2>Wiederherstellung und Verifizierung</h2>
<p>Mit dem dekodierten Fehlervektor $e'$ wird nun die Nachricht $m'$ wiederhergestellt und anschließend überprüft, ob das Chiffrat gültig ist.</p>
<ol>
    <li><strong>Wiederherstellung der Nachricht $m'$:</strong> Die Maskierung von $c_1$ wird rückgängig gemacht.
        <ul><li><strong>Berechnung:</strong> $m' \leftarrow c_1 \oplus L(e')$</li></ul>
    </li>
    <li><strong>Verifizierung (Implizite Zurückweisung):</strong> Es wird überprüft, ob die wiederhergestellte Nachricht $m'$ und der private Schlüsselwert $\mu$ den dekodierten Fehlervektor $e'$ erzeugen würden.
        <ul><li><strong>Vergleich:</strong> Ist $e' = H(m', \mu)$?</li></ul>
    </li>
</ol>

<details>
    <summary>Sicherheitsaspekt: IND-CCA</summary>
    <p>Dieser Schritt ist eine implizite Form der Zurückweisung ("implicit rejection"). Anstatt einfach einen Fehler zu melden, wenn etwas schiefgelaufen ist (was Angreifern Informationen preisgeben könnte), wird der Prozess immer zu Ende geführt. Die Verifizierung stellt sicher, dass das Chiffrat `ct` tatsächlich korrekt aus der wiederhergestellten Nachricht $m'$ generiert wurde.
    Erinnerung: $\mu = \pi_l(h)$ ist Teil des privaten Schlüssels. Der Vergleich ist also $e' = H(m', \pi_l(h))$.
    Wenn dieser Vergleich fehlschlägt (entweder weil die Dekodierung fehlgeschlagen ist oder das Chiffrat manipuliert wurde), wird der Prozess trotzdem fortgesetzt, aber mit einem anderen geheimen Wert ($\sigma$).</p>
</details>

---

<h2>Finale Ableitung des Schlüssels $K'$</h2>
<p>Abhängig vom Ergebnis der Verifizierung wird der gemeinsame geheime Schlüssel $K'$ auf eine von zwei Weisen abgeleitet.</p>
<ul>
    <li><strong>Wenn Verifizierung erfolgreich:</strong> $K' \leftarrow K(m', c)$</li>
    <li><strong>Wenn Verifizierung fehlschlägt:</strong> $K' \leftarrow K(\sigma, c)$</li>
</ul>

<details>
    <summary>Schutz vor Seitenkanalangriffen</summary>
    <p>Dieser Mechanismus stellt sicher, dass ein Angreifer nicht unterscheiden kann, ob die Entkapselung erfolgreich war oder nicht. In beiden Fällen wird ein Schlüssel $K'$ der korrekten Länge erzeugt und zurückgegeben. Wenn die Entkapselung fehlschlägt, wird der zufällige Wert $\sigma$ (Teil des privaten Schlüssels) verwendet, um einen gültigen, aber für den Angreifer unvorhersehbaren Schlüssel zu erzeugen. Dies verhindert Timing-Angriffe und andere Seitenkanal-Attacken, die auf Entkapselungsfehlern basieren.</p>
</details>

---

<h2>Ergebnis</h2>
<p>Das Endergebnis ist der wiederhergestellte gemeinsame geheime Schlüssel $K'$.</p>

<p><strong>Wiederhergestellter Schlüssel $K'$ (Base64):</strong></p>
<textarea class="key-input" rows="2" spellcheck="false" readonly>{{decapsulatedSharedSecret}}</textarea>

<div class="validation-box {{decaps_validation_class}}">{{decaps_validation_msg}}</div>
