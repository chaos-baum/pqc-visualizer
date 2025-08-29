<h2>Eingabewerte</h2>
<p>Für die Entkapselung werden der vollständige private Schlüssel $sk$ und das Chiffrat $C$ benötigt.</p>

<p><strong>Privater Schlüssel `sk` (Base64):</strong></p>
<textarea class="key-input" rows="4" spellcheck="false" readonly>{{secretKey}}</textarea>

<p><strong>Chiffrat `C` (Base64):</strong></p>
<textarea class="key-input" rows="4" spellcheck="false" readonly>{{ciphertext}}</textarea>

<button id="run-decaps-btn" class="btn-action" {{decaps_disabled}}>Schlüssel K entkapseln</button>

<hr>

<h2>Dekodierung des Fehlervektors $e'$</h2>
<p>Dies ist der entscheidende Schritt des gesamten Verfahrens. Mit der geheimen algebraischen Struktur des Goppa-Codes, die im privaten Schlüssel gespeichert ist, wird versucht, den Fehlervektor $e$ aus dem Chiffrat (Syndrom) $C$ zu rekonstruieren.</p>
<ul>
    <li><strong>Berechnung:</strong> $e' \leftarrow \text{DECODE}(C, \Gamma')$</li>
</ul>

<details>
    <summary>Der `DECODE`-Algorithmus </summary>
    <p>Der `DECODE`-Algorithmus für Goppa-Codes (typischerweise der Patterson-Algorithmus) nutzt die im privaten Schlüssel enthaltenen Informationen $(\Gamma' = (g, a))$:</p>
    <ol>
        <li><strong>Syndrom-Berechnung:</strong> Zuerst wird aus dem empfangenen Syndrom $C$ das Syndrom-Polynom $S(z)$ berechnet.</li>
        <li><strong>Lösen der Schlüsselfehlergleichung:</strong> Der Algorithmus löst die Schlüsselfehlergleichung $ \sigma(z) \equiv S(z) \cdot \omega(z) \pmod{g(z)} $. Das Ergebnis ist das <strong>Fehlerlokalisierungspolynom</strong> $\sigma(z)$.</li>
        <li><strong>Fehlerlokalisierung (Chien-Suche):</strong> Die Wurzeln des Polynoms $\sigma(z)$ im Körper $\mathbb{F}_{2^m}$ sind die Inversen der Stützstellen $\alpha_i$, an denen Fehler aufgetreten sind. Durch Testen aller Stützstellen aus der geheimen Liste $a = (\alpha_0, \dots, \alpha_{n-1})$ findet der Algorithmus die exakten Positionen der $t$ Fehler.</li>
        <li><strong>Rekonstruktion:</strong> Der Fehlervektor $e'$ wird rekonstruiert, indem an den gefundenen Fehlerpositionen eine '1' gesetzt wird.</li>
    </ol>
    <p>Wenn der Algorithmus erfolgreich ist und einen Vektor vom Gewicht $t$ findet, gibt er $e'$ zurück. Wenn er keinen solchen Vektor findet (z.B. weil das Chiffrat manipuliert wurde oder mehr als $t$ Fehler enthält), gibt er ein Fehlersymbol $\perp$ zurück.</p>
</details>

<p class="feedback-msg"><i>Hinweis: Der dekodierte Fehlervektor $e'$ ist geheim und wird vom Backend nicht an das Frontend übermittelt.</i></p>

<hr>

<h2>Verifizierung & Implizite Zurückweisung</h2>
<p>Um Seitenkanalangriffe zu verhindern, muss der Prozess auch bei einem Dekodierungsfehler konstant und ununterscheidbar weiterlaufen.</p>
<ol>
    <li><strong>Erfolg:</strong> Wenn $e' \neq \perp$, wird ein internes Flag $b \leftarrow 1$ gesetzt. Der dekodierte Vektor wird für den nächsten Schritt verwendet.</li>
    <li><strong>Fehler:</strong> Wenn $e' = \perp$, wird das Flag $b \leftarrow 0$ gesetzt. Anstelle des (nicht gefundenen) Fehlervektors wird der im privaten Schlüssel gespeicherte Zufallsvektor $s$ verwendet: $e' \leftarrow s$.</li>
</ol>

<details>
    <summary>Sicherheitsaspekt: IND-CCA2</summary>
    <p>Dieser Mechanismus ist entscheidend für die IND-CCA2-Sicherheit. Ein Angreifer, der ein ungültiges Chiffrat sendet, kann aus der Antwort nicht ableiten, ob die Dekodierung erfolgreich war oder nicht. In beiden Fällen wird ein Schlüssel $K$ zurückgegeben. Dies wird als "implizite Zurückweisung" (implicit rejection) bezeichnet.</p>
</details>

<hr>

<h2>Finale Ableitung des Schlüssels $K'$</h2>
<p>Der gemeinsame geheime Schlüssel $K'$ wird nun durch Hashing abgeleitet. Der Input für den Hash hängt vom Erfolg der Dekodierung ab, was durch das Flag $b$ gesteuert wird.</p>
<ul>
    <li><strong>Ableitung:</strong> $K' \leftarrow H(b, e', C)$</li>
</ul>
<p>$$ K' = H(\text{0x0b} \ || \ e' \ || \ C) $$</p>
<details>
    <summary>Spezifikationsdetails</summary>
    <ul>
        <li><strong>Im Erfolgsfall ($b=1$):</strong> Der Empfänger berechnet $K' = H(1, e, C)$. Da der Sender bei der Kapselung exakt denselben Hash berechnet hat, gilt $K' = K$.</li>
        <li><strong>Im Fehlerfall ($b=0$):</strong> Der Empfänger berechnet $K' = H(0, s, C)$. Dieser Schlüssel stimmt nicht mit dem des Senders überein, ist aber aus Sicht des Angreifers ein gültiger, pseudozufälliger Wert. Die Kommunikation schlägt fehl, aber es werden keine Informationen über den privaten Schlüssel preisgegeben.</li>
    </ul>
</details>

<hr>

<h2>Ergebnis</h2>
<p>Das Endergebnis ist der wiederhergestellte gemeinsame geheime Schlüssel $K'$.</p>

<p><strong>Wiederhergestellter Schlüssel $K'$ (Base64):</strong></p>
<textarea class="key-input" rows="2" spellcheck="false" readonly>{{decapsulatedSharedSecret}}</textarea>

<div class="validation-box {{decaps_validation_class}}">{{decaps_validation_msg}}</div>
