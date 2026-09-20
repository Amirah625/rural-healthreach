import { createFileRoute } from "@tanstack/react-router";
import { Info, MessageSquare, Smartphone } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { LocationBar } from "@/components/location/LocationBar";
import { getCountryOrDefault } from "@/lib/countries";
import { formatDistance } from "@/lib/health-places";
import { useLocation } from "@/lib/location/LocationProvider";
import { useFacilitySearch } from "@/lib/useFacilities";

type Language = "English" | "Yoruba" | "Hausa" | "Igbo";

const translations: Record<
  Language,
  {
    menu: string[];
    healthAssistant: string;
    cough: string;
    coughBlood: string;
    coughNoBlood: string;
    fever: string;
    headache: string;
    stomach: string;
    language: string;
    emergency: string;
    about: string;
    mainMenu: string;
    back: string;
    urgent: string;
    general: string;
    languageNames: string[];
  }
> = {
  English: {
    menu: [
      "1. Find Healthcare",
      "2. Emergency Help",
      "3. Health Assistant",
      "4. Language",
      "5. About RuralReach",
    ],
    healthAssistant:
      "Health Assistant\n\n1. Cough\n2. Fever\n3. Headache\n4. Stomach pain\n0. Main menu",
    cough: "Cough\n\n1. Coughing blood\n2. No blood\n0. Back",
    coughBlood:
      "Coughing blood can need urgent medical attention.\n\nPlease seek care at a nearby health facility.\n0. Main menu",
    coughNoBlood:
      "For a cough without blood:\n\nRest, drink fluids, and monitor your symptoms. If the cough becomes severe, lasts a long time, or you are having difficulty breathing, seek medical care.\n\n0. Main menu",
    fever:
      "Fever\n\nStay hydrated and rest. If the fever is severe, persistent, or accompanied by serious symptoms, seek medical care.\n\n0. Main menu",
    headache:
      "Headache\n\nRest, drink fluids, and monitor your symptoms. Seek medical care if the headache is severe, unusual, persistent, or accompanied by serious symptoms.\n\n0. Main menu",
    stomach:
      "Stomach pain\n\nRest and drink fluids. Seek medical care if the pain is severe, persistent, or accompanied by vomiting, bleeding, or other serious symptoms.\n\n0. Main menu",
    language: "Language\n\n1. English\n2. Yoruba\n3. Hausa\n4. Igbo\n0. Main menu",
    emergency: "Emergency",
    about:
      "RuralReach Health helps rural communities find healthcare information and nearby care.\n\n0. Main menu",
    mainMenu: "Main menu",
    back: "Back",
    urgent: "Please seek urgent medical care.",
    general: "Please seek medical care if symptoms become severe or persistent.",
    languageNames: ["English", "Yoruba", "Hausa", "Igbo"],
  },

  Yoruba: {
    menu: [
      "1. Wa Ile-iwosan",
      "2. Iranlọwọ Pajawiri",
      "3. Oluranlọwọ Ilera",
      "4. Ede",
      "5. Nipa RuralReach",
    ],
    healthAssistant:
      "Oluranlọwọ Ilera\n\n1. Ikọaláìdúró\n2. Iba\n3. Orififo\n4. Irora inu\n0. Akojọ akọkọ",
    cough: "Ikọaláìdúró\n\n1. Ẹjẹ wa ninu ikọ\n2. Ko si ẹjẹ\n0. Pada",
    coughBlood:
      "Ẹjẹ ninu ikọ le nilo itọju pajawiri.\n\nJọwọ lọ si ile-iwosan tabi ile-iṣẹ ilera to sunmọ.\n0. Akojọ akọkọ",
    coughNoBlood:
      "Fun ikọ ti ko ni ẹjẹ:\n\nSinmi, mu omi pupọ, ki o si ṣe akiyesi awọn aami aisan. Ti ikọ ba le, ba wa fun igba pipẹ, tabi mimi ba nira, wa itọju ilera.\n\n0. Akojọ akọkọ",
    fever:
      "Iba\n\nMu omi pupọ ki o sinmi. Ti iba ba le tabi ba tẹsiwaju, wa itọju ilera.\n\n0. Akojọ akọkọ",
    headache:
      "Orififo\n\nSinmi ki o mu omi. Ti orififo ba le, yatọ si deede, tabi ba tẹsiwaju, wa itọju ilera.\n\n0. Akojọ akọkọ",
    stomach:
      "Irora inu\n\nSinmi ki o mu omi. Ti irora ba le tabi ba tẹsiwaju, wa itọju ilera.\n\n0. Akojọ akọkọ",
    language: "Ede\n\n1. English\n2. Yoruba\n3. Hausa\n4. Igbo\n0. Akojọ akọkọ",
    emergency: "Pajawiri",
    about:
      "RuralReach Health n ran awọn agbegbe igberiko lọwọ lati wa alaye ilera ati itọju to sunmọ.\n\n0. Akojọ akọkọ",
    mainMenu: "Akojọ akọkọ",
    back: "Pada",
    urgent: "Jọwọ wa itọju ilera pajawiri.",
    general: "Wa itọju ilera ti awọn aami aisan ba le tabi ba tẹsiwaju.",
    languageNames: ["English", "Yoruba", "Hausa", "Igbo"],
  },

  Hausa: {
    menu: [
      "1. Neman Asibiti",
      "2. Taimakon Gaggawa",
      "3. Mataimakin Lafiya",
      "4. Harshe",
      "5. Game da RuralReach",
    ],
    healthAssistant:
      "Mataimakin Lafiya\n\n1. Tari\n2. Zazzabi\n3. Ciwon kai\n4. Ciwon ciki\n0. Babban menu",
    cough: "Tari\n\n1. Tari da jini\n2. Babu jini\n0. Koma baya",
    coughBlood:
      "Tari da jini na iya bukatar kulawar gaggawa.\n\nDa fatan je asibiti ko cibiyar lafiya mafi kusa.\n0. Babban menu",
    coughNoBlood:
      "Ga tari ba tare da jini ba:\n\nKa huta, ka sha ruwa, kuma ka kula da alamomin. Idan tari ya tsananta, ya dade, ko numfashi ya yi wahala, nemi kulawar lafiya.\n\n0. Babban menu",
    fever:
      "Zazzabi\n\nSha ruwa kuma ka huta. Idan zazzabin ya tsananta ko ya dade, nemi kulawar lafiya.\n\n0. Babban menu",
    headache:
      "Ciwon kai\n\nKa huta kuma ka sha ruwa. Idan ciwon kai ya tsananta ko ya dade, nemi kulawar lafiya.\n\n0. Babban menu",
    stomach:
      "Ciwon ciki\n\nKa huta kuma ka sha ruwa. Idan ciwon ya tsananta ko ya dade, nemi kulawar lafiya.\n\n0. Babban menu",
    language: "Harshe\n\n1. English\n2. Yoruba\n3. Hausa\n4. Igbo\n0. Babban menu",
    emergency: "Gaggawa",
    about:
      "RuralReach Health na taimaka wa al'ummomin karkara samun bayanan lafiya da wuraren kula da lafiya mafi kusa.\n\n0. Babban menu",
    mainMenu: "Babban menu",
    back: "Koma baya",
    urgent: "Da fatan nemi kulawar lafiya cikin gaggawa.",
    general: "Nemi kulawar lafiya idan alamomin sun tsananta ko suka dade.",
    languageNames: ["English", "Yoruba", "Hausa", "Igbo"],
  },

  Igbo: {
    menu: [
      "1. Chọta Ụlọ Ọgwụ",
      "2. Enyemaka Mberede",
      "3. Onye Enyemaka Ahụ Ike",
      "4. Asụsụ",
      "5. Banyere RuralReach",
    ],
    healthAssistant:
      "Onye Enyemaka Ahụ Ike\n\n1. Ụkwara\n2. Ahụ ọkụ\n3. Isi ọwụwa\n4. Ihe mgbu afọ\n0. Isi menu",
    cough: "Ụkwara\n\n1. Ọbara dị na ụkwara\n2. Ọ dịghị ọbara\n0. Laghachi",
    coughBlood:
      "Ọbara dị na ụkwara nwere ike ịchọ nlekọta ahụike ngwa ngwa.\n\nBiko gaa n'ụlọ ọgwụ ma ọ bụ ebe ahụike kacha nso.\n0. Isi menu",
    coughNoBlood:
      "Maka ụkwara na-enweghị ọbara:\n\nZuo ike, ṅụọ mmiri, ma lelee mgbaàmà gị. Ọ bụrụ na ụkwara ahụ ka njọ, ọ dị ogologo oge, ma ọ bụ iku ume siri ike, chọọ nlekọta ahụike.\n\n0. Isi menu",
    fever:
      "Ahụ ọkụ\n\nṄụọ mmiri ma zuru ike. Ọ bụrụ na ahụ ọkụ ahụ ka njọ ma ọ bụ dị ogologo oge, chọọ nlekọta ahụike.\n\n0. Isi menu",
    headache:
      "Isi ọwụwa\n\nZuo ike ma ṅụọ mmiri. Ọ bụrụ na isi ọwụwa ahụ ka njọ ma ọ bụ dị ogologo oge, chọọ nlekọta ahụike.\n\n0. Isi menu",
    stomach:
      "Ihe mgbu afọ\n\nZuo ike ma ṅụọ mmiri. Ọ bụrụ na mgbu ahụ ka njọ ma ọ bụ dị ogologo oge, chọọ nlekọta ahụike.\n\n0. Isi menu",
    language: "Asụsụ\n\n1. English\n2. Yoruba\n3. Hausa\n4. Igbo\n0. Isi menu",
    emergency: "Mberede",
    about:
      "RuralReach Health na-enyere obodo ndị dị n'ime ime obodo ịchọta ozi ahụike na ebe nlekọta ahụike kacha nso.\n\n0. Isi menu",
    mainMenu: "Isi menu",
    back: "Laghachi",
    urgent: "Biko chọọ nlekọta ahụike ngwa ngwa.",
    general: "Chọọ nlekọta ahụike ma ọ bụrụ na mgbaàmà ahụ ka njọ ma ọ bụ dị ogologo oge.",
    languageNames: ["English", "Yoruba", "Hausa", "Igbo"],
  },
};

export const Route = createFileRoute("/ussd")({
  head: () => ({
    meta: [
      { title: "USSD / SMS Access (Demo) | RuralReach Health" },
      {
        name: "description",
        content:
          "A prototype demonstration of how RuralReach Health could work on basic phones through USSD and SMS, using your real nearby facilities.",
      },
      {
        property: "og:title",
        content: "USSD / SMS Access (Demo) | RuralReach Health",
      },
      {
        property: "og:description",
        content: "How RuralReach Health could work without internet access.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Ussd,
});

function Ussd() {
  const [screen, setScreen] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("English");

  const { location } = useLocation();
  const country = getCountryOrDefault(location?.countryCode);
  const results = useFacilitySearch("all", "");
  const places = results.data?.places ?? [];

  const t = translations[language];

  const nearbyText = results.isPending
    ? "Searching for facilities near you..."
    : places.length === 0
      ? "No facilities found. Set your location in the app."
      : places
          .slice(0, 3)
          .map(
            (p, i) =>
              `${i + 1}. ${p.name}${
                p.distanceKm !== undefined
                  ? ` (${formatDistance(p.distanceKm)})`
                  : ""
              }`,
          )
          .join("\n");

  const showMainMenu = () => {
    setScreen(null);
  };

  const selectLanguage = (selected: Language) => {
    setLanguage(selected);
    setScreen(null);
  };

  const responses: Record<string, string> = {
    "1": `Near ${location?.label ?? "you"}:\n${nearbyText}\n\n0. ${t.mainMenu}`,

    "2": `${t.emergency} in ${country.name}:\n${country.emergency
      .map((e) => `${e.label}: ${e.number}`)
      .join("\n")}\n\n0. ${t.mainMenu}`,

    "3": t.healthAssistant,

    "4": t.language,

    "5": t.about,

    "3-cough": t.cough,

    "3-cough-blood": t.coughBlood,

    "3-cough-no-blood": t.coughNoBlood,

    "3-fever": t.fever,

    "3-headache": t.headache,

    "3-stomach": t.stomach,
  };

  const currentScreen = screen ? responses[screen] : t.menu.join("\n");

  const handleKey = (key: string) => {
    if (key === "0") {
      showMainMenu();
      return;
    }

    if (!screen) {
      setScreen(key);
      return;
    }

    if (screen === "3") {
      const symptomScreens: Record<string, string> = {
        "1": "3-cough",
        "2": "3-fever",
        "3": "3-headache",
        "4": "3-stomach",
      };

      if (symptomScreens[key]) {
        setScreen(symptomScreens[key]);
      }

      return;
    }

    if (screen === "3-cough") {
      if (key === "1") {
        setScreen("3-cough-blood");
      } else if (key === "2") {
        setScreen("3-cough-no-blood");
      }

      return;
    }

    if (screen === "4") {
      const languages: Record<string, Language> = {
        "1": "English",
        "2": "Yoruba",
        "3": "Hausa",
        "4": "Igbo",
      };

      const selected = languages[key];

      if (selected) {
        selectLanguage(selected);
      }

      return;
    }
  };

  return (
    <AppShell title="USSD / SMS Access">
      <p className="rise flex items-start gap-2 rounded-2xl border border-highlight bg-highlight/25 p-3 text-xs font-semibold text-highlight-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Prototype demonstration — actual USSD/SMS integration is planned for a
        future version. Dialling {country.ussdCode} will not connect to the app.
      </p>

      <div className="mt-3">
        <LocationBar compact />
      </div>

      <section className="card-surface rise mt-4 p-5">
        <h2 className="flex items-center gap-2 text-base font-extrabold">
          <Smartphone className="h-5 w-5 text-leaf" aria-hidden="true" />
          No internet? No problem.
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Dial{" "}
          <span className="font-bold text-foreground">
            {country.ussdCode}
          </span>{" "}
          on any basic phone — this simulation uses the facilities we found
          near you.
        </p>

        <div className="mx-auto mt-4 max-w-xs rounded-3xl border-4 border-primary bg-primary/95 p-3 shadow-lift">
          <div
            className="rounded-2xl bg-accent p-4 font-mono text-sm leading-relaxed text-accent-foreground"
            aria-live="polite"
          >
            <p className="font-bold">RuralReach Health</p>

            <div className="mt-2 whitespace-pre-line">
              {currentScreen}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {["1", "2", "3", "4", "5", "0"].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleKey(key)}
                aria-label={
                  key === "0"
                    ? "Back to main menu"
                    : `Choose option ${key}`
                }
                className="tap rounded-xl bg-card py-3 text-base font-extrabold text-primary"
              >
                {key}
              </button>
            ))}
          </div>

          <p className="mt-3 text-center text-xs text-primary-foreground/80">
            Demo keypad — nothing is dialled
          </p>
        </div>
      </section>

      <section className="card-surface rise mt-4 p-5">
        <h2 className="flex items-center gap-2 text-base font-extrabold">
          <MessageSquare className="h-5 w-5 text-leaf" aria-hidden="true" />
          Planned SMS access
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          In a future version, sending a keyword such as{" "}
          <span className="font-bold text-foreground">HELP</span> to a shortcode
          would return the nearest facilities by text message.
        </p>
      </section>
    </AppShell>
  );
}