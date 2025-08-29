<h2>Eingabewerte</h2>
<p>Für die Kapselung wird der öffentliche Schlüssel $pk = (h, s)$ benötigt, der im <strong>KeyGen</strong>-Schritt erzeugt wurde.</p>

<p><strong>Öffentlicher Schlüssel `pk` (Base64):</strong></p>
<textarea class="key-input" rows="8" spellcheck="false" readonly>{{publicKey}}</textarea>

<button id="run-encaps-btn" class="btn-action" {{pk_disabled}}>Ciphertext & Schlüssel K generieren</button>

---

<h2>Erzeugung der ephmeren Geheimnisse</h2>
<p>Der Prozess beginnt mit der Erzeugung mehrerer temporärer, geheimer Werte.</p>
<ul>
    <li><strong>Zufällige Nachricht $m$ & $Salt$:</strong> Eine zufällige Nachricht $m$ und ein $salt$ werden erzeugt.</li>
    <li><strong>Seed-Ableitung $\theta$ :</strong> Aus $m$, dem $salt$ und einem Teil des öffentlichen Schlüssels wird ein Seed $\theta$ abgeleitet:
        $$ \theta \leftarrow \mathcal{G}(m \ || \ \text{firstBytes}(\text{pk}, 32) \ || \ \text{salt}) $$
    </li>
    <li><strong>Fehlervektoren:</strong> Aus dem Seed $\theta$ werden drei dünn besetzte Polynome $(e, r_1, r_2)$ mit dem Gewicht $w_e = w_r = {{t}}$ generiert.</li>
</ul>

<details>
    <summary>Spezifikationsdetails</summary>
    <p>Die Einbeziehung des `salt` und eines Teils des öffentlichen Schlüssels in die Seed-Ableitung ist eine entscheidende Sicherheitsmaßnahme gegen Multi-Target-Angriffe. Die Vektoren $e, r_1, r_2$ sind die ephemeren Geheimnisse dieser Instanz. Ihre Dünnbesetztheit ist der Schlüssel zur späteren Entschlüsselung.</p>
</details>

---

<h2>Berechnung des Chiffrats $c = (u, v)$</h2>
<p>Das Chiffrat $c$ besteht aus zwei Polynomen, $u$ und $v$, die aus den öffentlichen und den ephemeren Werten berechnet werden.</p>
<ul>
    <li><strong>Berechnung von $u$:</strong>
        $$ u = r_1 + h \cdot r_2 $$
    </li>
    <li><strong>Berechnung von $v$:</strong>
        $$ v = \text{truncate}(\text{Encode}(m) + s \cdot r_2 + e, l) $$
    </li>
</ul>

<details>
    <summary>Mathematischer Hintergrund</summary>
    <ul>
        <li>Die Berechnung von $u$ verschleiert die Vektoren $r_1$ und $r_2$ mit dem öffentlichen Polynom $h$.</li>
        <li>In der Berechnung von $v$ wird die Nachricht $m$ zuerst mit dem öffentlichen fehlerkorrigierenden Code kodiert ($\text{Encode}(m) = mG$). Anschließend wird das Ergebnis mit $s \cdot r_2$ und dem Fehlervektor $e$ addiert. Das `truncate` entfernt überflüssige Bits, die durch die Arithmetik im Ring entstehen.</li>
    </ul>
</details>

<p><strong>Chiffrat `ct` (Base64):</strong></p>
<textarea class="key-input" rows="4" spellcheck="false" readonly>{{ciphertext}}</textarea>

---

<h2>Ableitung des gemeinsamen Schlüssels $K$</h2>
<p>Der finale gemeinsame geheime Schlüssel $K$ wird aus der ursprünglichen Nachricht $m$ und dem vollständigen Chiffrat $c$ abgeleitet.</p>
<ul>
    <li><strong>Ableitung:</strong> $K \leftarrow \mathcal{K}(m, c)$</li>
</ul>

<details>
    <summary>Zweck</summary>
    <p>Dieser letzte Hashing-Schritt stellt sicher, dass der gemeinsame Schlüssel $K$ von der gesamten Transaktion (Nachricht $m$ und Chiffrat $c$) abhängt. Dies ist Teil der Fujisaki-Okamoto-Transformation, die verwendet wird, um IND-CCA-Sicherheit zu erreichen.</p>
</details>

<p><strong>Gemeinsamer geheimer Schlüssel $K$ (Base64):</strong></p>
<textarea class="key-input" rows="2" spellcheck="false" readonly>{{sharedSecret}}</textarea>
