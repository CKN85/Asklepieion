## 2. The Basis of Membrane Potentials

As hinted prior, membrane potentials are generated as a product of the uneven distribution of ions between the intracellular fluid (ICF) and extracellular fluid (ECF) (Table 1). This uneven distribution again arises from the capacitative property of the cell surface membrane (CSM), and hence, one would be correct in deducing that the CSM is integral for the development of such membrane potentials.

A sole membrane, however, is insufficient in forming the membrane potential — channels for ions to move through are also required in order to complete the circuit. This can be easily visualized in the Planar Lipid Bilayer Experiments.

**Table 1. Typical ICF and ECF ion concentrations, and the resulting net electrochemical driving force at a resting $V_m$ of $-60\ \text{mV}$** *(values as tabulated in Boron & Boulpaep,* Medical Physiology*, Table 5‑3 — a "typical cell", not any one specific tissue)*

| Ion | $[X]_o$ (ECF) | $[X]_i$ (ICF) | $E_X$ (Nernst potential) | Driving force $(V_m-E_X)$ |
|---|---|---|---|---|
| $\text{Na}^+$ | 145 mM | 15 mM | $+61$ mV | $-121$ mV |
| $\text{K}^+$ | 4.5 mM | 120 mM | $-88$ mV | $+28$ mV |
| $\text{Ca}^{2+}$ | 1.2 mM | $10^{-4}$ mM (100 nM) | $+125$ mV | $-185$ mV |
| $\text{Cl}^-$ | 116 mM | 20 mM | $-47$ mV | $-13$ mV |

A negative driving force means the electrochemical gradient pushes a *cation* inward (or an *anion* outward); a positive driving force means the reverse. Notice that at rest, essentially every ion in this table is being pushed across the membrane by a non-zero force — none of them are individually at equilibrium. Why the cell nonetheless sits at a stable $-60\ \text{mV}$ rather than drifting is taken up properly in §2.6.

### 2.1 The Planar Lipid Bilayer Experiment

A planar lipid bilayer is formed by spreading a phospholipid solution across a ~200 µm hole to separate 2 aqueous chambers. A transmembrane voltage is measured using an Ag/AgCl electrode connected through salt bridges. By applying an uneven concentration of a specific ion, we can measure the membrane potential ($V_m$) across the 2 chambers.

*Figure 1 — [insert diagram here]. From Boron and Boulpaep: movement of ions is required to complete the circuit, allowing current to flow from one electrode, through the chamber, to the other electrode, and hence permitting the measurement of $V_m$. Ion channels are required for this charge movement.*

Again, in order to complete the circuit and allow the ion to move from one chamber to another, we must add channels. For K⁺ (which will be the ion used in the HOM experiments) a common ionophore added is valinomycin or gramicidin. Valinomycin, isolated from *Streptomyces fulvissimus*, is a carrier which physically ferries K⁺ across a lipid bilayer (Figure 2a). Gramicidin, produced by *Bacillus brevis* (now reclassified as *Brevibacillus brevis*), forms a narrow water-filled pore, with a diameter of roughly 0.4 nm — small enough to allow "single-file" movement of ions through, and hence creates a highly K⁺-selective conductance pathway (Figure 2b).

*Figure 2a — [insert diagram here]. Valinomycin acting as a mobile carrier: it binds a K⁺ ion at one membrane face, diffuses across the bilayer core with the ion caged inside its hydrophilic pocket, and releases it at the far face.*

*Figure 2b — [insert diagram here]. Gramicidin acting as a channel: a permanently open, narrow aqueous pore spanning the bilayer, through which K⁺ ions queue and move single-file.*

> **Note.** Valinomycin and gramicidin are a useful contrasting pair precisely because they represent the two archetypal mechanisms of ion transport across a membrane — *carrier* versus *channel* — despite converging on a similar net effect (selective K⁺ conductance) in this experiment. Carriers like valinomycin have turnover rates on the order of $10^3\text{–}10^4$ ions/second because they must physically reorient within the bilayer; channels like gramicidin, which simply open a continuous pore, can pass $10^7\text{–}10^8$ ions/second — several orders of magnitude faster, which is one reason essentially all physiological, rapidly-gated ion transport (action potentials, synaptic transmission) is channel-mediated rather than carrier-mediated.

### 2.2 The Nernst Potential

How does an ionic gradient in real cells translate to a membrane potential? To understand this, we must first break down the ionic gradients into their components. The ionic gradient does not only include its concentration gradient — the difference in concentration between the ECF and ICF — but also an electrical gradient: as the difference in "amounts" of ions in each compartment would translate to differences in charge (hence, the gradient is often referred to as an electrochemical gradient, containing both electro- (electrical) and chemical- (diffusive) forces).

Take a sample of KCl separated by a CSM only permeable to K⁺, and hence only K⁺ can move to generate the $V_m$, with ICF concentration greater than the ECF concentration. The diffusive gradient of potassium would understandably be from ICF (the higher concentration) to ECF. However, because the ICF also contains higher amounts of Cl⁻, the higher anionic concentration within the ICF would also attract the K⁺ from the ECF, or alternatively, prevent diffusion of K⁺ from ICF to ECF. Thus it can be concluded that the electrical and diffusive forces act in opposition, rather than in tandem!

This is an extremely important property, as there will eventually exist a potential at which the electrical and diffusive forces are equal to each other, and hence the net movement of potassium is 0: this is the equilibrium, and the potential at this equilibrial state is known as the equilibrium potential, or alternatively, the Nernst potential.

Understanding that the Nernst potential arises from the opposing nature of electrical and diffusive forces allows us to derive an equation calculating the Nernst potential:

**1. The diffusive (chemical) energy gradient** is given by the free-energy change per mole of X moving from the ICF (concentration $[X]_i$) to the ECF (concentration $[X]_o$):

$$\Delta G_{\text{chem}} = RT\ln\frac{[X]_o}{[X]_i}$$

**2. The electrical energy gradient** for that same mole of charge (valence $z$) moving through the membrane voltage $V_m = \Psi_i - \Psi_o$ is:

$$\Delta G_{\text{elec}} = zF(\Psi_o-\Psi_i) = -zFV_m$$

**3. At equilibrium**, the diffusive and electrical energy gradients are equal and opposite, so their sum is zero. Thus,

$$\Delta G_{\text{chem}} + \Delta G_{\text{elec}} = 0 \quad\Longrightarrow\quad RT\ln\frac{[X]_o}{[X]_i} - zFV_m = 0$$

$$\boxed{\,V_m = E_X = \frac{RT}{zF}\ln\frac{[X]_o}{[X]_i} = -\frac{RT}{zF}\ln\frac{[X]_i}{[X]_o}\,}$$

— the Nernst equation. You can check this against Table 1: for $\text{K}^+$ at $37\,^\circ\text{C}$ ($RT/F \approx 26.7\ \text{mV}$), $E_K = 26.7\ \text{mV}\times\ln(4.5/120) = -87.7\ \text{mV}\approx -88\ \text{mV}$, exactly the tabulated value.

Alternatively, we can simplify this equation such that at a temperature of 20 °C ($RT/F\cdot\ln 10 \approx 58\ \text{mV}$), the Nernst equation for potassium and chloride is:

$$E_K = 58\ \text{mV}\times\log_{10}\frac{[\text{K}^+]_o}{[\text{K}^+]_i} \qquad\qquad E_{Cl} = -58\ \text{mV}\times\log_{10}\frac{[\text{Cl}^-]_o}{[\text{Cl}^-]_i}$$

Note the opposite sign between the cation and the anion — a direct consequence of $z=+1$ for K⁺ versus $z=-1$ for Cl⁻ in the equation above. (At $37\,^\circ\text{C}$, the equivalent constant is closer to $61.5\ \text{mV}$; the "58 mV" figure specifically belongs to $20\,^\circ\text{C}$, which is why it's worth always checking which temperature a textbook is quoting before plugging numbers in.)

Although the Nernst equation is indeed a useful tool when equating only a singular ion, its problems and assumptions become apparent in experiments. Hodgkin and Horowicz (1959) used a frog muscle fibre which was bathed in a solution of K₂SO₄ in order to replace Cl⁻ and eliminate anion contribution, isolating K⁺ contribution alone, and plotted a semi-log graph between $V_m$ and $\log[\text{K}^+]_o$. When comparing the Nernst equation (which should yield a straight line) and the experimental values, they found that under $[\text{K}^+]_o < 10\ \text{mM}$, the experimental values started to deviate from the Nernst prediction. It was later understood that this deviation is due to the contribution of other ions within the ECF, primarily Na⁺, and hence the degree of deviation is dependent on the relative contribution of Na⁺ to K⁺ — that is, on the ratio of their permeabilities.

> **Why sulfate, specifically?** SO₄²⁻ was chosen deliberately, not arbitrarily: it is a large, poorly permeant anion, so replacing the muscle's normal Cl⁻ bath with K₂SO₄ removes Cl⁻'s contribution to $V_m$ almost entirely, leaving a fiber whose potential should — if the Nernst equation held perfectly — be governed by $[\text{K}^+]_o$ alone. That the data still peel away from a straight line at low $[\text{K}^+]_o$ is precisely what motivates the next section: a single-ion equation cannot be the whole story, no matter how carefully you isolate the ion.

### 2.3 The Goldman–Hodgkin–Katz Equation

To extend the Nernst equation, the GHK equation was derived in order to allow powerful and more accurate prediction of the membrane potential. The first step is to compute an ionic current by considering a single ion species moving through the membrane in isolation. The second step is to sum the total macroscopic currents of each ion species to ultimately obtain $V_m$.

The GHK equation was developed on the basis of the Nernst–Planck electrodiffusion theory, by treating the membrane as a "black box": concentrations and voltage are specified only at the two faces of the membrane, and everything about the membrane's actual internal structure is abstracted away into a single measured constant (the permeability, introduced below).

Before understanding the derivation, it is first important to note the assumptions made in deriving this equation:

1. The membrane is homogeneous throughout, with a constant thickness.
2. Movement of each ion is independent of every other ion, and hence one ion's movement does not affect another's — the *independence principle*.
3. The permeability of the membrane to an ion is constant, calculated as a function of the diffusion and partition coefficients as well as the membrane thickness.
4. The electric field within the membrane is constant, and hence voltage varies linearly as you move through the membrane from one compartment to the other. Hence its alternative name: the *Constant Field Equation*.

The GHK flux equation for an ion, S, is given (Flax, 2008) as:

$$I_S = P_S z_S^2\,\frac{VF^2}{RT}\cdot\frac{[S]_i - [S]_o\,e^{-z_S FV/RT}}{1-e^{-z_S FV/RT}}$$

However, the GHK equation cannot be evaluated directly at $V_m=0$: substituting $V=0$ gives

$$I_S(0) = P_S z_S^2\,\frac{(0)F^2}{RT}\cdot\frac{[S]_i-[S]_o\cdot 1}{1-1} = 0\times\frac{[S]_i-[S]_o}{0}$$

— an indeterminate form, since the prefactor vanishes while the fraction blows up (given $[S]_i\neq[S]_o$ in general). Direct substitution cannot resolve this; the value at $V=0$ can only be recovered as a *limit*, which is exactly what §2.3.2 does with L'Hôpital's rule.

#### 2.3.1 The Derivation of the GHK Equation

The starting point is the Poisson–Nernst–Planck equations.

Nernst–Planck flux (diffusion + electrical drift), for an ion of valence $z$ and diffusion coefficient $D$:

$$J_S = -D\left(\frac{dc}{dx} + \frac{zF}{RT}\,c\,\frac{d\psi}{dx}\right)$$

Poisson equation (the field produced by the ions themselves):

$$\frac{d^2\psi}{dx^2} = -\frac{F}{\varepsilon}\sum_i z_i c_i$$

Instead of solving Poisson's equation for $\psi$, GHK assumes the electric field is uniform across the membrane, i.e. $\psi$ varies linearly across the membrane thickness. For a membrane spanning $x\in[0,L]$ with $\psi(0)=V$ (inside) and $\psi(L)=0$ (outside):

$$\psi(x) = V\left(1-\frac{x}{L}\right)$$

Define the dimensionless potential:

$$u(x) = \frac{zF\,\psi(x)}{RT}$$

so that $u(0)=zFV/RT$ and $u(L)=0$. This single move decouples the system: Poisson's equation is no longer needed, and the Nernst–Planck equation becomes a linear ODE we can integrate.

Using the integrating factor $e^{u}$, the flux equation rewrites compactly as:

$$J_S = -D\,e^{-u}\,\frac{d}{dx}\!\left(c\,e^{u}\right)$$

At steady state $J_S$ is constant (no ions are created or destroyed inside the membrane), so multiply through by $e^{u}/(-D)$ and integrate from $0$ to $L$:

$$\left(\frac{-J_S}{D}\right)\int_0^L e^{u}\,dx = \Big[c\,e^{u}\Big]_0^L = c(L)e^{u(L)} - c(0)e^{u(0)}$$

Because the field is constant, $u(x)$ is linear in $x$, so the integral has a clean closed form:

$$\int_0^L e^{u}\,dx = L\cdot\frac{e^{u(L)}-e^{u(0)}}{u(L)-u(0)}$$

Substitute $u(0)=zFV/RT$, $u(L)=0$, and write $c(0)=c_{\text{in}}$, $c(L)=c_{\text{out}}$. Solving for $J_S$:

$$J_S = \frac{D}{L}\cdot\frac{zFV}{RT}\cdot\frac{c_{\text{in}}\,e^{zFV/RT}-c_{\text{out}}}{e^{zFV/RT}-1}$$

The current density is $I=zF\,J_S$. Define the permeability $P=D/L$ (folding membrane thickness into a single measured constant):

$$I = P\,\frac{z^2F^2V}{RT}\cdot\frac{c_{\text{in}}\,e^{zFV/RT}-c_{\text{out}}}{e^{zFV/RT}-1}$$

Multiply numerator and denominator by $e^{-zFV/RT}$ to put it in the standard form:

$$I = \frac{P\,z^2F^2\,V}{RT}\cdot\frac{c_{\text{in}} - c_{\text{out}}\,e^{-zFV/RT}}{1-e^{-zFV/RT}}$$

> **Note on sign conventions.** You will notice this final line matches the "headline" GHK equation given above only if you flip the sign inside every exponential — and that's not a mistake, it's a direct consequence of an earlier choice: this derivation set $\psi(0)=V$ at the *inside* face ($x=0$) and $\psi(L)=0$ at the *outside* face. Some textbooks instead put $x=0$ at the outside face, which flips the sign of every exponent throughout. Both derivations are internally consistent and give the same physical answer for $I$ — they only *look* different because of where "$x=0$" was defined. This is one of the most common sources of confusion when comparing GHK equations between two textbooks (or, as here, between two sections of the same derivation!): always check which face is defined as $x=0$, and which direction $V_m$ is measured, before assuming two "different" formulas actually disagree.

#### 2.3.2 Using GHK To Show That the Reversal Potential Is Not Where Current Is Zero

In order to show that when flux is 0, $V$ is not 0 (or vice versa), we must use L'Hôpital's rule, which states that if $f(a)=g(a)=0$ and $g'(a)\neq0$, then

$$\lim_{V\to a}\frac{f(V)}{g(V)} = \frac{f'(a)}{g'(a)}$$

Which is equivalent to what is written in Flax (2008). The extensive workings are below:

$$\Phi_S(V) = \frac{P_S z^2 F^2}{RT}\times\frac{V\left(X_{Si}-X_{So}e^{-kV}\right)}{1-e^{-kV}}$$

Let $f(V) = V\left(X_{Si}-X_{So}e^{-kV}\right)$ and $g(V) = 1-e^{-kV}$, so that $\Phi_S(V) = C\cdot f(V)/g(V)$.

Write $f(V) = V\times h(V)$, where $h(V) = X_{Si}-X_{So}e^{-kV}$. By the product rule:

$$f'(V) = h(V) + V\cdot h'(V)$$

Since $h'(V) = X_{So}\,k\,e^{-kV}$:

$$f'(V) = X_{Si} - X_{So}e^{-kV} + X_{So}\,k\,V\,e^{-kV}$$

Grouping the $X_{So}e^{-kV}$ terms:

$$f'(V) = X_{Si} + X_{So}e^{-kV}(kV-1)$$

Substituting $k = zF/RT$:

$$C\cdot f'(V) = \frac{P_S z^2F^2}{RT}\left[X_{Si} + X_{So}\,e^{-zFV/RT}\left(\frac{zFV}{RT}-1\right)\right]$$

And for the denominator:

$$g(V) = 1-e^{-kV} \qquad\Longrightarrow\qquad g'(V) = k\,e^{-kV} = \frac{zF}{RT}\,e^{-kV}$$

**Applying L'Hôpital's rule.** Since $f(0)=g(0)=0$ and $g'(0)\neq0$:

$$\lim_{V\to 0}\frac{f(V)}{g(V)} = \frac{f'(0)}{g'(0)}$$

Evaluating at $V=0$:

$$f'(0) = X_{Si} + X_{So}\cdot 1\cdot(0-1) = X_{Si}-X_{So} \qquad\qquad g'(0) = k\cdot 1 = \frac{zF}{RT}$$

So:

$$\lim_{V\to 0}\frac{f(V)}{g(V)} = \frac{X_{Si}-X_{So}}{zF/RT} = (X_{Si}-X_{So})\cdot\frac{RT}{zF}$$

$$\lim_{V\to 0}\Phi_S(V) = C\times(X_{Si}-X_{So})\times\frac{RT}{zF} = \frac{P_Sz^2F^2}{RT}\times\frac{RT}{zF}\times(X_{Si}-X_{So})$$

$$\boxed{\lim_{V\to 0}\Phi_S(V) = P_S\,z\,F\,(X_{Si}-X_{So})}$$

This confirms a basic fact about diffusion: if there's more of an ion on one side of the membrane than the other, ions will flow across driven purely by that concentration gradient — even with zero electrical push. Electricity isn't the only thing moving ions; concentration differences do it too. So "no voltage" does not mean "no current."

That leads directly into the concept of *reversal potential* — the voltage at which net flux actually does hit zero. Since flux isn't zero at $V=0$ (in general), the reversal potential isn't 0 either, but rather some other voltage where the electrical push exactly cancels the diffusive push from the concentration gradient. That's the membrane's natural equilibrium point for that ion, and for a membrane permeable to only one ion species, it's exactly the Nernst potential from §2.2.

#### 2.3.3 Using GHK To Derive a Unified Resting Membrane Potential Equation

For a cation (valence $z=+1$, e.g. K⁺, Na⁺), using $\psi = FV/RT$:

$$I_{\text{cation}} = \frac{P\,F^2\,V}{RT}\times\frac{X_{\text{in}}-X_{\text{out}}\,e^{-\psi}}{1-e^{-\psi}}$$

For an anion (valence $z=-1$, e.g. Cl⁻), plugging $z=-1$ into the general $z^2$ formula, but tracking the sign of $z$ carefully through the derivation:

$$I_{\text{anion}} = \frac{P\,F^2\,V}{RT}\times\frac{X_{\text{out}}-X_{\text{in}}\,e^{-\psi}}{1-e^{-\psi}}$$

— note the swap of "in" and "out" relative to the cation case, which falls directly out of $z=-1$ flipping the sign of every $z$-dependent term in the derivation above.

Summing all three major contributors:

$$I_{\text{total}} = \frac{F^2V}{RT\left(1-e^{-\psi}\right)}\Big[P_K([\text{K}]_i-[\text{K}]_oe^{-\psi}) + P_{Na}([\text{Na}]_i-[\text{Na}]_oe^{-\psi}) + P_{Cl}([\text{Cl}]_o-[\text{Cl}]_ie^{-\psi})\Big]$$

At the resting (reversal) potential, $I_{\text{total}}=0$. Since the prefactor $F^2V/\big(RT(1-e^{-\psi})\big)$ is nonzero at the voltage we're solving for, only the bracket needs to vanish:

$$P_K[\text{K}]_i + P_{Na}[\text{Na}]_i + P_{Cl}[\text{Cl}]_o = e^{-\psi}\big(P_K[\text{K}]_o + P_{Na}[\text{Na}]_o + P_{Cl}[\text{Cl}]_i\big)$$

Solve for $e^{-\psi}$:

$$e^{-\psi} = \frac{P_K[\text{K}]_i + P_{Na}[\text{Na}]_i + P_{Cl}[\text{Cl}]_o}{P_K[\text{K}]_o + P_{Na}[\text{Na}]_o + P_{Cl}[\text{Cl}]_i}$$

Since $\psi = FV/RT$:

$$-\frac{FV}{RT} = \ln\left[\frac{P_K[\text{K}]_i + P_{Na}[\text{Na}]_i + P_{Cl}[\text{Cl}]_o}{P_K[\text{K}]_o + P_{Na}[\text{Na}]_o + P_{Cl}[\text{Cl}]_i}\right]$$

$$\boxed{\,V_m = \frac{RT}{F}\ln\left[\frac{P_K[\text{K}]_o + P_{Na}[\text{Na}]_o + P_{Cl}[\text{Cl}]_i}{P_K[\text{K}]_i + P_{Na}[\text{Na}]_i + P_{Cl}[\text{Cl}]_o}\right]\,}$$

— the Goldman (or Goldman–Hodgkin–Katz) voltage equation.

### 2.4 Measuring Membrane Potentials

There are many ways in which the membrane potential can be measured. One of the most prominent, however, is through the use of a glass-coated microelectrode, which can be impaled into the cell to measure the transmembrane potential with respect to the potential of the ECF. Care must be taken to ensure and confirm that the CSM is not damaged by the impaled electrode, and that it forms a tight seal, in order to obtain accurate measurements of $V_m$.

Alternatively, for small cells such as the red blood cell, or organelles such as the mitochondria, a fluorescent dye whose optical properties change as a result of differing $V_m$ can be used. Alternatively, cells genetically modified to express a voltage-sensitive protein tagged with GFP can also be used. One can then calibrate the different potential differences against different absorption/emission values of the dyes to produce a standard curve.

---

## Further Depth

### 2.5 The Chord Conductance Equation — An Alternative to GHK

The GHK voltage equation of §2.3.3 is not the only way to combine several ions' contributions into one $V_m$. A simpler, and in many contexts equally useful, alternative starts from Ohm's law applied separately to each ion: the current carried by ion $X$ through its own channels is

$$I_X = g_X\left(V_m - E_X\right)$$

where $g_X$ is the *conductance* the membrane presents to $X$ (essentially, how many $X$-selective channels are open, multiplied by each channel's single-channel conductance) and $(V_m-E_X)$ is exactly the driving-force term from Table 1. At steady state, the sum of all ionic currents must be zero ($\sum I_X = 0$, since the membrane itself stores no net charge once $V_m$ has settled). Solving $\sum g_X(V_m-E_X)=0$ for $V_m$ gives the **chord conductance equation**:

$$V_m = \frac{g_K E_K + g_{Na}E_{Na} + g_{Cl}E_{Cl}}{g_K+g_{Na}+g_{Cl}}$$

— a weighted average of each ion's own Nernst potential, weighted by how conductive the membrane currently is to that ion. Compare this with the GHK voltage equation: GHK weights by *permeability* ($P_X$, a constant-field diffusion parameter, roughly fixed for a given channel population), while the chord conductance equation weights by *conductance* ($g_X$, an explicitly electrical parameter that can itself depend on voltage and time). For many purposes the two give numerically similar answers near rest, and either is a legitimate description of a membrane at steady state — but they are not derived from the same physical assumptions, and they diverge more sharply from each other as $V_m$ moves away from rest.

The chord conductance form is the one Hodgkin and Huxley actually built their 1952 model of the action potential on, precisely because it separates cleanly into a $g_X$ that they could measure directly by voltage-clamping the squid giant axon and watching how it changed with voltage and time — the modern picture of voltage-gated channels opening and closing. GHK's constant-field assumption (assumption 4, §2.3) becomes a much shakier approximation once $g_{Na}$ is changing by orders of magnitude over a millisecond, which is one reason the two equations tend to appear in different contexts in a physiology course: GHK for resting potential, chord conductance for the dynamics of the action potential.

### 2.6 Why the Resting Potential Is a Steady State, Not a True Equilibrium

Look again at Table 1: at a resting $V_m$ of $-60\ \text{mV}$, K⁺ has a driving force of $+28\ \text{mV}$ and Na⁺ has a driving force of $-121\ \text{mV}$. Neither is zero. That means neither ion is individually at its own Nernst equilibrium at rest — K⁺ is continuously being pushed to leak *out* of the cell, and Na⁺ is continuously being pushed to leak *in*, through whatever channels happen to be open at rest.

This is an easy point to gloss over, but it matters: a true Nernst equilibrium (§2.2) requires no ongoing energy input to sustain, by definition — net flux is already zero. The resting potential of a real cell is not that. It is a **non-equilibrium steady state**: $V_m$ is stable and unchanging *only because* the small, continuous leak of K⁺ out and Na⁺ in is being continuously and exactly counteracted by the Na⁺/K⁺-ATPase, which uses one molecule of ATP to pump 3 Na⁺ out and 2 K⁺ in against both of their gradients. Poison the pump (e.g., with ouabain, or simply by depriving the cell of ATP) and $V_m$ does not stay put — it drifts toward whatever the passive GHK/chord-conductance equation predicts as the channels' combined equilibrium, since there is no longer anything actively re-establishing the gradients the channels are leaking down.

This also means the resting potential of a real cell is not free — it costs metabolic energy, continuously, for as long as the cell is alive, which is why a substantial fraction (often cited around 20–40%, and considerably higher in neurons) of a resting cell's basal ATP consumption goes directly to the Na⁺/K⁺-ATPase.

A smaller, separate point: because the pump moves 3 positive charges out for every 2 it brings in, it is itself directly *electrogenic* — it contributes a small hyperpolarizing current on top of its (much larger) indirect effect of maintaining the concentration gradients that the GHK/chord conductance equations depend on. In most cells this direct contribution is only a few millivolts, but it is measurably real, and briefly poisoning the pump produces an immediate small depolarization even before the ion gradients themselves have had time to run down.

### 2.7 What Hodgkin and Katz Actually Measured

The permeability ratios $P_K:P_{Na}:P_{Cl}$ in the GHK equation are not arbitrary — they come from experiment. In their original 1949 voltage-clamp study of the squid giant axon, Hodgkin and Katz measured a resting permeability ratio of roughly

$$P_K : P_{Na} : P_{Cl} \approx 1 : 0.04 : 0.45$$

which is why, at rest, a cell's $V_m$ sits so much closer to $E_K$ than to $E_{Na}$ in the GHK equation of §2.3.3 — K⁺'s much higher permeability dominates the weighted average, even though Na⁺'s driving force (Table 1) is far larger in magnitude. This is also precisely why many simplified treatments of the resting potential drop the Na⁺ term almost entirely and treat $V_m\approx E_K$ as a first approximation, then explain the small remaining gap by Na⁺'s minor but non-zero contribution.

Notice, too, that $P_{Cl}$ is not negligible in this ratio (0.45 relative to K⁺'s 1) — which connects directly back to the Hodgkin–Horowicz experiment of §2.2. That experiment specifically had to *engineer around* Cl⁻'s contribution (by substituting in impermeant SO₄²⁻) precisely because Cl⁻ permeability in real membranes is often too large to ignore. Whether Cl⁻ is close to its own equilibrium at rest varies considerably by tissue: in many neurons $E_{Cl}$ sits close to $V_m$ so Cl⁻'s net contribution to resting current is small in practice despite a respectable permeability, whereas in skeletal muscle — the tissue Hodgkin and Horowicz actually used — $\text{Cl}^-$ carries a substantial fraction of the resting conductance, which is exactly why isolating K⁺'s contribution required deliberately removing Cl⁻ from the bath rather than simply assuming it away.

### 2.8 When the Independence Principle Breaks Down

Assumption 2 of the GHK derivation (§2.3) — that each ion's movement is independent of every other ion's — is a simplification, and it is known to fail in exactly the kind of channel already introduced in §2.1: gramicidin. Because gramicidin's pore is only ~0.4 nm wide, ions cannot pass each other inside it; they are forced into genuine single-file movement, which means an ion sitting inside the pore can electrostatically block or "knock on" the next ion waiting to enter. The flux of one ion species through a single-file pore can measurably depend on the concentration of a *second*, competing ion species — a direct violation of independence, and a real, experimentally observed phenomenon known as the **anomalous mole-fraction effect**: in a mixture of two permeant ion species, the total conductance through a single-file channel can actually *dip below* the conductance seen with either pure ion species alone, which the independence principle (under which conductances should simply add) cannot explain at all.

This doesn't make GHK useless — for most physiological channels, at physiological ion concentrations, independence is a good enough approximation that the equation's predictions hold up well. But it is a genuine, testable assumption rather than a law of nature, and single-file channels like gramicidin are exactly where — and why — it was first shown to break.

### 2.9 From Microelectrodes to Patch-Clamp

The sharp intracellular microelectrode of §2.4 measures the *voltage* of a cell, but it cannot easily isolate the current flowing through one individual ion channel — the electrode sits in the bulk cytoplasm, recording the summed effect of every channel in the membrane at once. The **patch-clamp technique**, developed by Erwin Neher and Bert Sakmann in the late 1970s (work for which they shared the 1991 Nobel Prize in Physiology or Medicine), solved this by sealing a fire-polished glass micropipette directly onto a tiny patch of membrane — small enough, ideally, to contain only a handful of channels, or even just one.

From that single seal, four distinct recording configurations can be obtained, each answering a different question:

- **Cell-attached** — the pipette seals onto the membrane with the cell still intact, recording single-channel currents in their normal cytoplasmic environment.
- **Whole-cell** — a brief suction pulse ruptures the patch under the pipette, giving the pipette electrical access to the entire cell interior; this is the configuration most often used to record whole-cell currents or to voltage-clamp an entire cell, extending Hodgkin and Huxley's original squid-axon voltage-clamp approach down to single small cells.
- **Inside-out** — the pipette (with its patch still attached) is pulled away from the cell entirely, flipping the patch so its cytoplasmic face is now exposed to the bath — useful for testing how intracellular messengers directly affect a channel.
- **Outside-out** — a variant pulled from the whole-cell configuration, exposing the patch's *extracellular* face to the bath instead.

Patch-clamp recording is what ultimately allows single-channel conductance to be measured directly, turning the kind of macroscopic, whole-population $I$–$V$ relationship the GHK and chord conductance equations describe into countable, discrete channel-opening events — the experimental link between the ionophore-in-a-bilayer picture of §2.1 and a real channel sitting in a real cell membrane.

### 2.10 A Brief History: From Bernstein to Hodgkin–Huxley

The idea that a resting potential arises from selective ion permeability is older than the Nernst equation's common physiological use might suggest. Julius Bernstein proposed his "membrane hypothesis" in 1902: that the cell membrane at rest is selectively permeable to K⁺, and that this alone accounts for the resting potential — essentially an early, qualitative version of the Nernst-equation reasoning in §2.2, arrived at before the modern electrochemical machinery for deriving it existed.

Bernstein's hypothesis was substantially correct but incomplete: it predicted that $V_m$ should simply track $E_K$ via the Nernst equation, and — as Hodgkin and Horowicz's later data in §2.2 showed directly — real membranes deviate from that prediction, especially at low external K⁺. Resolving *why* required Hodgkin, Huxley, and Katz's voltage-clamp experiments on the squid giant axon through the late 1940s and early 1950s (Hodgkin & Katz's 1949 permeability-ratio measurements of §2.7 among them), culminating in the 1952 Hodgkin–Huxley model of the action potential — the chord-conductance-based description of §2.5 — for which Hodgkin, Huxley, and Eccles shared the 1963 Nobel Prize in Physiology or Medicine. In a real sense, the GHK equation (1943/1949) and the Hodgkin–Huxley model (1952) are two contemporaneous, complementary answers to the same gap Bernstein's original hypothesis left open.

---

### References

- Boron, W. F., & Boulpaep, E. L. *Medical Physiology* (values in Table 1 and Figure 1 caption follow this text's conventions).
- Flax, S. (2008), as cited in the original source material for the GHK derivation (§2.3–2.3.3).
- Goldman, D. E. (1943). Potential, impedance, and rectification in membranes. *Journal of General Physiology*.
- Hodgkin, A. L., & Katz, B. (1949). The effect of sodium ions on the electrical activity of the giant axon of the squid. *Journal of Physiology*, 108(1), 37–77.
- Hodgkin, A. L., & Horowicz, P. (1959). The influence of potassium and chloride ions on the membrane potential of single muscle fibres. *Journal of Physiology*, 148(1), 127–160.
- Hodgkin, A. L., & Huxley, A. F. (1952). A quantitative description of membrane current and its application to conduction and excitation in nerve. *Journal of Physiology*, 117(4), 500–544.
- Neher, E., & Sakmann, B. (1976). Single-channel currents recorded from membrane of denervated frog muscle fibres. *Nature*, 260, 799–802.
