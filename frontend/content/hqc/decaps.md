<h2>Eingabewerte</h2>
<p>Für die Entkapselung werden der private Schlüssel $sk = (x, y)$ und das Chiffrat $ct = (u, v)$ benötigt.</p>

<p><strong>Privater Schlüssel `sk` (Base64):</strong></p>
<textarea class="key-input" rows="4" spellcheck="false" readonly>{{secretKey}}</textarea>

<p><strong>Chiffrat `ct` (Base64):</strong></p>
<textarea class="key-input" rows="4" spellcheck="false" readonly>{{ciphertext}}</textarea>

<button id="run-decaps-btn" class="btn-action" {{decaps_disabled}}>Schlüssel K entkapseln</button>

---

<h2>Wiederherstellung der kodierten Nachricht</h2>
<p>Der erste Schritt der Entschlüsselung besteht darin, den Einfluss des öffentlichen Schlüssels aus dem Chiffrat-Teil $v$ zu eliminieren. Dies geschieht durch die Berechnung von $v'$:</p>
$$ v' = v - u \cdot y $$

<details>
    <summary>Die Magie der Mathematik</summary>
    <p>Dieser Schritt ist die "Falltür" in Aktion. Lassen Sie uns die Terme einsetzen, um zu sehen, was passiert:</p>
    <p>Wir wissen aus der Kapselung:</p>
    <ul>
        <li>$u = r_1 + h \cdot r_2$</li>
        <li>$v = \text{Encode}(m) + s \cdot r_2 + e$</li>
    </ul>
    <p>Und aus der Schlüsselgenerierung:</p>
    <ul>
        <li>$s = x + h \cdot y$</li>
    </ul>
    <p>Setzen wir dies in die Formel für $v'$ ein:</p>
    <p>$$ v' = (\text{Encode}(m) + (x + h \cdot y) \cdot r_2 + e) - (r_1 + h \cdot r_2) \cdot y $$</p>
    <p>$$ v' = \text{Encode}(m) + x \cdot r_2 + h \cdot y \cdot r_2 + e - r_1 \cdot y - h \cdot r_2 \cdot y $$</p>
    <p>Da die Multiplikation im Ring kommutativ ist ( $ h \cdot y \cdot r_2 = h \cdot r_2 \cdot y $ ) und wir in $F_2$ arbeiten (Addition ist Subtraktion), heben sich die Terme mit $h$ auf:</p>
    <p>$$ v' = \text{Encode}(m) + \underbrace{x \cdot r_2 - r_1 \cdot y + e}_{\text{Fehlerterm } e'} $$</p>
    <p>Das Ergebnis ist die kodierte Nachricht, gestört durch einen neuen, dünn besetzten Fehlerterm $e'$, der aus den geheimen Werten $x, y, r_1, r_2, e$ besteht.</p>
</details>

---

<h2>Dekodierung der Nachricht $m'$</h2>
<p>Der wiederhergestellte Wert $v'$ wird nun dem leistungsstarken, öffentlichen Fehlerkorrektur-Decoder übergeben.</p>
<ul>
    <li><strong>Dekodierung:</strong> $m' \leftarrow \text{Decode}(v')$</li>
</ul>

<details>
    <summary>Der Fehlerkorrektur-Code</summary>
    <p>Der Decoder (eine Kombination aus Reed-Muller und Reed-Solomon) ist darauf ausgelegt, eine große Anzahl von Fehlern zu korrigieren. Da der Fehlerterm $e'$ aus der Multiplikation und Addition von dünn besetzten Polynomen resultiert, ist sein erwartetes Hamming-Gewicht klein genug, um vom Code korrigiert zu werden.</p>
    <p>Wenn die Anzahl der Fehler innerhalb der Kapazität des Codes liegt, gibt der Decoder die ursprüngliche Nachricht $m$ fehlerfrei zurück ($m' = m$). Andernfalls schlägt die Dekodierung fehl.</p>
</details>

---

<h2>Verifizierung & Finale Schlüsselableitung</h2>
<p>Um IND-CCA-Sicherheit zu gewährleisten, wird die wiederhergestellte Nachricht $m'$ verwendet, um den Kapselungsprozess zu wiederholen und das Ergebnis mit dem ursprünglichen Chiffrat zu vergleichen.</p>
<ol>
    <li><strong>Seed-Ableitung $\theta'$:</strong> $\theta' \leftarrow \mathcal{G}(m' \ || \ \text{firstBytes}(\text{pk}, 32) \ || \ \text{salt})$</li>
    <li><strong>Fehlervektoren neu erzeugen:</strong> $(e', r'_1, r'_2) \leftarrow \theta'$</li>
    <li><strong>Chiffrat neu berechnen:</strong> $c' = (u', v') \leftarrow \text{Encapsulate}(pk, m', \theta')$</li>
    <li><strong>Vergleich:</strong> Ist $c = c'$?</li>
</ol>
<p>Abhängig vom Ergebnis wird der Schlüssel $K'$ abgeleitet:</p>
<ul>
    <li><strong>Wenn $c=c'$ (Erfolg):</strong> $K' \leftarrow \mathcal{K}(m', c)$</li>
    <li><strong>Wenn $c \neq c'$ (Fehler):</strong> $K' \leftarrow \mathcal{K}(\sigma, c)$ (wobei $\sigma$ ein geheimer Wert aus dem privaten Schlüssel ist)</li>
</ul>

---

<h2>Ergebnis</h2>
<p>Das Endergebnis ist der wiederhergestellte gemeinsame geheime Schlüssel $K'$.</p>

<p><strong>Wiederhergestellter Schlüssel $K'$ (Base64):</strong></p>
<textarea class="key-input" rows="2" spellcheck="false" readonly>{{decapsulatedSharedSecret}}</textarea>

<div class="validation-box {{decaps_validation_class}}">{{decaps_validation_msg}}</div>
