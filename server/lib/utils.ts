//

export const intval = (value: any) => {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  const num = parseInt(value);
  return Number.isNaN(num) ? 0 : num;
};

export const getLanguageLogo = (language: string) => {
  const alias: Record<string, string> = {
    gdscript: "godot",
    gap: "godot",
    html: "html5",
    css: "css3",
  };

  let lang = language.toLowerCase().replace(/[^a-zA-Z]/g, "");
  lang = alias[lang] || lang;
  const uri = `https://github.com/devicons/devicon/raw/master/icons/${lang}/${lang}-original.svg`;

  return uri;
};
