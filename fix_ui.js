const fs = require('fs');
const file = 'src/components/ResumeUploader.tsx';
let code = fs.readFileSync(file, 'utf8');

// Migrate old schema to new schema inside renderStructuredCards
code = code.replace(
  '  const renderStructuredCards = (data: ResumeData) => {',
  `  const renderStructuredCards = (rawData: any) => {
    console.log("Rendering structured cards with data:", JSON.stringify(rawData, null, 2));
    
    // Normalize old schema to new schema for backwards compatibility
    const data: ResumeData = {
      personal: rawData.personal || { name: '', email: '', phone: '', location: '' },
      experience: rawData.experience || rawData.workExperience || [],
      education: rawData.education || rawData.educationHistory || [],
      projects: rawData.projects || [],
      achievements: rawData.achievements || rawData.awards || [],
      skills: rawData.skills && !Array.isArray(rawData.skills) ? rawData.skills : {
        languages: Array.isArray(rawData.skills) ? rawData.skills : [],
        frontend: [], backend: [], frameworks: [], databases: [], cloud: [], devops: [], tools: [], others: []
      },
      links: rawData.links || { linkedin: '', github: '', portfolio: '', website: '', leetcode: '', codeforces: '', codechef: '', hackerrank: '', geeksforgeeks: '', medium: '', other: [] },
      certifications: rawData.certifications || [],
      leadership: rawData.leadership || [],
      publications: rawData.publications || [],
      volunteer: rawData.volunteer || []
    };
`
);

fs.writeFileSync(file, code);
console.log('Fixed UI mapping');
