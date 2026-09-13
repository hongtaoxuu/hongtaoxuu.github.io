// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "Publications",
          description: "Research publications by Hongtao Xu on machine learning systems, long-context training, and scientific computing.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "news-one-paper-is-accepted-by-icml-25-sparkles-see-you-in-vancouver-canada",
          title: 'One Paper is accepted by ICML’25! :sparkles: See you in Vancouver, Canada 🇨🇦🍁!...',
          description: "",
          section: "News",},{id: "news-one-paper-is-accepted-by-ispa-25-ieee-international-symposium-on-parallel-and-distributed-processing-with-applications-see-you-in-shenyang-china-️",
          title: 'One Paper is accepted by ISPA’25 (IEEE International Symposium on Parallel and Distributed...',
          description: "",
          section: "News",},{id: "news-one-paper-is-accepted-by-neurips-25-see-you-in-san-diego-usa-️",
          title: 'One Paper is accepted by NeurIPS’25! See you in San Diego, USA 🇺🇸🏖️!...',
          description: "",
          section: "News",},{id: "news-one-paper-is-accepted-by-icml-26-sparkles",
          title: 'One Paper is accepted by ICML’26! :sparkles:',
          description: "",
          section: "News",},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%78%75%68%6F%6E%67%74%61%6F%37%31%34@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/hongtaoxuu", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=qc6CJjYAAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
