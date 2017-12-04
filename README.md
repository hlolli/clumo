# lumo and csound <3 clumo
Clumo is a patched version of [Lumo](https://github.com/anmonteiro/lumo) for Csound Score pre-processor.

# How to use

```Csound
<CsoundSynthesizer>
<CsOptions>
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 32
nchnls = 2
0dbfs = 1.0


instr 1
  out poscil(0.1, p4)
endin

</CsInstruments>
<CsScore bin="clumo">

(require '[clojure.string :as string])

(defn generate-event [n]
  (str "i 1 " n " 1 " (+ 20 (rand-int 1000))))

(string/join "\n" (map #(generate-event %) (range 0 10)))

</CsScore>
</CsoundSynthesizer>
```

* Everything within the CsScore tags is a Clojurescript evaluation block. The return value must be string with valid Csound Score.
* `require`,`require-macros` and `import` work. `js/require` works for node modules.
* `ns` macro will NOT work from within CsScore tags, but can be present in files that are required.
* Classpath is by default only the root directory. Namespaces for external cljs file will therefore have to follow the relative folder-nesting structure from the root folder.

Find more information on Lumo here https://github.com/anmonteiro/lumo
Find more information about Clojure https://github.com/matthiasn/Clojure-Resources

Some helpful clojurescript exercises http://clojurescriptkoans.com/


Distributed under the Eclipse Public License, same as Lumo (see [LICENSE](./LICENSE)).
