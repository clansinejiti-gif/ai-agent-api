const careerTracks = [
  {
    trackId: "tr_backend_01",
    title: "Backend Engineering",
    domain: "Software Engineering",
    keySkills: ["Node.js", "SQL/NoSQL", "System Design", "API Security"],
    industryDemand: "High",
  },
  {
    trackId: "tr_frontend_01",
    title: "Frontend Engineering",
    domain: "Software Engineering",
    keySkills: ["React", "TypeScript", "CSS Architecture", "Performance"],
    industryDemand: "High",
  },
  {
    trackId: "tr_data_01",
    title: "Data Engineering",
    domain: "Data Science",
    keySkills: ["Python", "Spark", "SQL", "Data Pipelines"],
    industryDemand: "High",
  },
  {
    trackId: "tr_devops_01",
    title: "DevOps / Cloud Engineering",
    domain: "Software Engineering",
    keySkills: ["Docker", "Kubernetes", "AWS/GCP", "CI/CD"],
    industryDemand: "High",
  },
];

export const getTracks = async (domain) => {
  let results = [...careerTracks];

  if (domain) {
    const search = domain.toLowerCase().trim();
    results = results.filter((track) =>
      track.domain.toLowerCase().includes(search),
    );
  }

  return results.map(({ trackId, title, keySkills, industryDemand }) => ({
    trackId,
    title,
    keySkills,
    industryDemand,
  }));
};
