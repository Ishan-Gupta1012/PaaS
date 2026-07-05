export interface TemplateConfig {
  slug: string;
  name: string;
  subtitle: string;
  variant: "dark" | "purple" | "light";
  available: boolean;
  dashboardImageUrl?: string;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    slug: "creative-edge",
    name: "Creative Edge",
    subtitle: "Dynamic / Gradients",
    variant: "purple",
    available: true,
    dashboardImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOvfJaZT5MJh6Hy8qm9f1so-_6fBlE4Z3XSz3ZbQkd1pzFc1_5gmmBIj0EAx_9bBIkVOS46P7ZlROMYvlNm-N00A4pCvy7fRw6qC94LMS-au8Ss1Hx51U8Nqdkr4ewIhvAtg732ElXQBd51LHWc6PpiHpK_wvjJVudgSo2424OPApq2coKlzOdRk2VfreRt0Qvr8triaz0fl-C_PSRscpWzfBqg3PrQ8ezwkUvh-l4BIv2oYAfjQx8Oh3JcuJAhKwXO9K6WVzljl18",
  },
  {
    slug: "software-engineer",
    name: "Developer Pro",
    subtitle: "Dark Mode / IDE Layout",
    variant: "dark",
    available: true,
    dashboardImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSLLADsqXlADz4oz1nmlWaooa1bW1LrWhW59n3PPgAsAtloqA1xMz8tQNl32KQadAzYcKrgoXZBQvFpr9YH6xLaRLG9aDLAt7RFJXWb_TOQPbbmfTnfwiUKvH-HA4B9SGps4w9pv67yQmiVfIMmmGjZ6xGuGjiDY-h5oL7Z2Vd8VjsPf1neVyGtMA0lKsVbbEwovenPM7IIgQjhb6k8ywbjAPZPwdb86wXg6Jj74AM0SyOZT_0QhHynhBqlB9HTSBH1LbbizAzCSY6",
  },
  {
    slug: "modern",
    name: "Modern Clean",
    subtitle: "Light Mode / Minimalist",
    variant: "light",
    available: true,
    dashboardImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCb5Ph4hVNHzkKfHfBaxriRVGW6ZENZLbupKHPZOGBuGtOWgX_77MFe1oxNA9g_PvtPO-aHZkjOhehHoVKQC0lDXZPmz1_t_kkRAZHXRUmsMcUV9kGdbbCvjTZBNgKcygrbgq3X7yV3RUquLM1M3oBs5VtNmBgFd_CVwKBm9WOZbLLbSnh7XtvoE7AXmnS6ncf72GsWlAVyvETIO0VRJHzwIXQ06sFm9fE7lEoa9P6RXwENBxMLdEmGDg8XyPH4veOZYghcY7w76nRZ",
  },
];

export function getTemplate(slug: string): TemplateConfig | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}
