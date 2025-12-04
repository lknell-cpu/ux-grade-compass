import React, { useState } from 'react';
import { Check, Info, Users, FileText, Target, Award, Layers, Compass } from 'lucide-react';
import UserMenu from './components/auth/UserMenu';

// Data Model based on the provided PDF content
const GRADE_DATA = {
  G5: {
    id: 'G5',
    label: 'Associate Designer',
    shortLabel: 'G5',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    dotColor: 'bg-blue-500',
    scopeVal: 12, // 0-100 scale for visualization
    profVal: 15,
    role: <><strong>Emerging contributor</strong> learning to deliver user-centered solutions <strong>with guidance</strong>.</>,
    artifacts: <><strong>Flows, Wireframes, Prototypes</strong>.</>,
    partners: ['APM', 'PM'],
  },
  G6: {
    id: 'G6',
    label: 'UX Designer',
    shortLabel: 'G6',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    dotColor: 'bg-indigo-500',
    scopeVal: 25,
    profVal: 35,
    role: <><strong>Independent contributor</strong> focused on <strong>consistent execution</strong> and collaboration.</>,
    artifacts: <><strong>Flows, Journeys, Wireframes</strong>, Foundational Artifacts (e.g., personas).</>,
    partners: ['APM', 'Senior PM'],
  },
  G7: {
    id: 'G7',
    label: 'Senior Designer',
    shortLabel: 'G7',
    color: 'bg-violet-100 text-violet-800 border-violet-200',
    dotColor: 'bg-violet-500',
    scopeVal: 45,
    profVal: 55,
    role: <><strong>Experienced designer</strong> delivering quality solutions and <strong>guiding team practices</strong>.</>,
    artifacts: <><strong>Flows, Journeys, Wireframes, Personas</strong>, Journey Maps.</>,
    partners: ['Senior PM', 'Director'],
  },
  G8: {
    id: 'G8',
    label: 'Lead Designer',
    shortLabel: 'G8',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    dotColor: 'bg-purple-500',
    scopeVal: 60,
    profVal: 70,
    role: <><strong>Independent driver</strong> of complex initiatives and <strong>cross-functional leader</strong>.</>,
    artifacts: <><strong>Experience Maps, System Models</strong>, Flow Diagrams (ensure consistency/scalability).</>,
    partners: ['Director', 'Senior Director'],
  },
  G9: {
    id: 'G9',
    label: 'Principal Designer',
    shortLabel: 'G9',
    color: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
    dotColor: 'bg-fuchsia-500',
    scopeVal: 75,
    profVal: 85,
    role: <><strong>Strategic design leader</strong> driving cross-cloud vision and <strong>systems innovation</strong>.</>,
    artifacts: <><strong>Experience Maps, System Models, Scalable Architectures</strong>, Cross-cloud Patterns.</>,
    partners: ['Senior Director', 'VP'],
  },
  G10: {
    id: 'G10',
    label: 'Architect',
    shortLabel: 'G10',
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    dotColor: 'bg-pink-500',
    scopeVal: 88,
    profVal: 95,
    role: <><strong>Visionary</strong> shaping <strong>enterprise-scale</strong> experience systems.</>,
    artifacts: <><strong>Systems that redefine complexity</strong>. Frameworks, methods, or engagement models.</>,
    partners: ['VP', 'SVP'],
  },
  G11: {
    id: 'G11',
    label: 'Principal Architect',
    shortLabel: 'G11',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    dotColor: 'bg-rose-500',
    scopeVal: 98,
    profVal: 98,
    role: <><strong>Enterprise visionary</strong> redefining strategy, systems, and organizational value through <strong>innovation</strong>.</>,
    artifacts: <><strong>Enterprise-wide Experience Architectures</strong>, New frameworks that transform operations.</>,
    partners: ['SVP'],
  },
};

const Tooltip = ({ children, text }) => (
  <div className="group relative flex items-center">
    {children}
    <div className="absolute bottom-full mb-2 hidden w-48 rounded bg-gray-800 p-2 text-xs text-white shadow-lg group-hover:block z-50">
      {text}
      <div className="absolute top-full left-4 -mt-1 h-2 w-2 -rotate-45 bg-gray-800"></div>
    </div>
  </div>
);

const SliderTrack = ({ title, leftLabel, rightLabel, midLabels, dataPoints, property }) => {
  return (
    <div className="mb-10 w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          {title}
        </h3>
      </div>
      
      <div className="relative h-16 w-full px-4">
        {/* Track Line */}
        <div className="absolute top-1/2 left-0 h-2 w-full -translate-y-1/2 rounded-full bg-gray-200"></div>
        
        {/* Background Segments (Optional visualization aid) */}
        <div className="absolute top-1/2 left-0 h-2 w-full -translate-y-1/2 flex rounded-full overflow-hidden opacity-20">
           <div className="w-1/4 bg-blue-300 h-full"></div>
           <div className="w-1/4 bg-purple-300 h-full"></div>
           <div className="w-1/4 bg-fuchsia-300 h-full"></div>
           <div className="w-1/4 bg-rose-300 h-full"></div>
        </div>

        {/* Labels */}
        <div className="absolute top-full mt-2 w-full flex justify-between text-xs font-medium text-gray-500 uppercase tracking-wider">
          <span>{leftLabel}</span>
          {midLabels && midLabels.map((l, i) => <span key={i} className="hidden sm:block">{l}</span>)}
          <span>{rightLabel}</span>
        </div>

        {/* Data Points */}
        {dataPoints.map((grade) => (
          <div
            key={grade.id}
            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500 ease-out"
            style={{ left: `${grade[property]}%`, transform: `translate(-50%, -50%)` }}
          >
            <div className={`h-4 w-4 rounded-full border-2 border-white shadow-md ${grade.dotColor} z-10`}></div>
            <div className={`mt-3 rounded px-2 py-1 text-xs font-bold shadow-sm ${grade.color}`}>
              {grade.shortLabel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ComparisonCard = ({ selectedGrades }) => {
  if (selectedGrades.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400">
        <Layers className="mb-2 h-10 w-10 opacity-20" />
        <p>Select grades above to see the comparison matrix</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 font-semibold text-gray-500 w-1/6">Dimension</th>
              {selectedGrades.map(grade => (
                <th key={grade.id} className="px-6 py-4 font-bold text-gray-800 w-1/4">
                  <div className="flex items-center gap-3">
                    <span className={`inline-block h-3 w-3 rounded-full ${grade.dotColor}`}></span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{grade.shortLabel}</span>
                      <span className="text-gray-900">{grade.label}</span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="group hover:bg-blue-50/30 transition-colors">
              <td className="px-6 py-6 font-medium text-gray-500 align-top">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-blue-400" />
                  <span>Primary Role</span>
                </div>
              </td>
              {selectedGrades.map(grade => (
                <td key={grade.id} className="px-6 py-6 text-gray-700 align-top leading-relaxed">
                  {grade.role}
                </td>
              ))}
            </tr>
            <tr className="group hover:bg-purple-50/30 transition-colors">
              <td className="px-6 py-6 font-medium text-gray-500 align-top">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-purple-400" />
                  <span>Artifacts</span>
                </div>
              </td>
              {selectedGrades.map(grade => (
                <td key={grade.id} className="px-6 py-6 text-gray-700 align-top leading-relaxed">
                  {grade.artifacts}
                </td>
              ))}
            </tr>
            <tr className="group hover:bg-emerald-50/30 transition-colors">
              <td className="px-6 py-6 font-medium text-gray-500 align-top">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-emerald-400" />
                  <span>Product Partners</span>
                </div>
              </td>
              {selectedGrades.map(grade => (
                <td key={grade.id} className="px-6 py-6 text-gray-700 align-top leading-relaxed">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(grade.partners) ? (
                      grade.partners.map((partner, idx) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                        >
                          {partner}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {grade.partners}
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function UXGradeCompass() {
  const [selectedIds, setSelectedIds] = useState(['G6', 'G7']);

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(g => g !== id));
    } else {
      // Simple alphabetical sort to keep the UI consistent
      const newSelection = [...selectedIds, id].sort((a, b) => {
        const numA = parseInt(a.replace('G', ''));
        const numB = parseInt(b.replace('G', ''));
        return numA - numB;
      });
      setSelectedIds(newSelection);
    }
  };

  const selectedGrades = selectedIds.map(id => GRADE_DATA[id]);
  const allGrades = Object.values(GRADE_DATA);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-md">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">UX Grade Compass</h1>
              <p className="text-xs text-slate-500 font-medium">Career Clarity Tool</p>
            </div>
          </div>
          <UserMenu />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        
        {/* Grade Selector */}
        <section className="mb-12">
          <p className="mb-6 text-sm text-slate-600">
            Based on the <a 
              href="https://docs.google.com/document/d/17IPmWhP4uvGZGC_zJ-oW4-z1CD6jxfChwQ4CUlcro_g/edit?tab=t.ty7g4ek51eun" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              UX Career Framework
            </a>, this tool is intended to help alleviate ambiguity between designer roles, especially when collaborating together.
          </p>
          
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Select Levels</h2>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-500">
              {selectedIds.length} Selected
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {allGrades.map((grade) => {
              const isSelected = selectedIds.includes(grade.id);
              
              return (
                <button
                  key={grade.id}
                  onClick={() => toggleSelection(grade.id)}
                  className={`relative flex flex-col items-center justify-center rounded-xl border p-3 transition-all duration-200 cursor-pointer
                    ${isSelected 
                      ? `${grade.color} ring-2 ring-offset-1 ring-blue-500 shadow-md scale-105 z-10` 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50'}
                  `}
                >
                  {isSelected && (
                    <div className="absolute -right-2 -top-2 rounded-full bg-blue-600 p-0.5 text-white shadow-sm">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70">{grade.shortLabel}</span>
                  <span className="mt-1 text-[10px] font-medium leading-tight text-center line-clamp-2 w-full h-6 flex items-center justify-center">
                    {grade.label}
                  </span>
                </button>
              );
            })}
          </div>
          {selectedIds.length === 0 && (
             <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
               <Info className="h-4 w-4" /> Please select at least one grade level.
             </p>
          )}
        </section>

        {/* Visualizations */}
        {selectedIds.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Sliders Column */}
            <div className="lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <div className="mb-2">
                 <h2 className="text-lg font-bold text-slate-800 mb-1">Proficiency Mapping</h2>
                 <p className="text-sm text-slate-500 mb-8">Visualizing where your selected roles fall on the core career spectrums.</p>
               </div>

               <SliderTrack 
                 title={<><Target className="h-4 w-4 text-indigo-500" /> Scope & Impact</>}
                 property="scopeVal"
                 dataPoints={selectedGrades}
                 leftLabel="Tactical"
                 rightLabel="Transformative"
                 midLabels={['Strategic', 'Innovative']}
               />

               <div className="h-8"></div> {/* Spacer */}

               <SliderTrack 
                 title={<><Award className="h-4 w-4 text-emerald-500" /> UX Core Proficiency</>}
                 property="profVal"
                 dataPoints={selectedGrades}
                 leftLabel="Emergent"
                 rightLabel="Expert"
                 midLabels={['Competent', 'Proficient', 'Advanced']}
               />
            </div>
          </div>
        )}

        {/* Comparison Matrix */}
        <section>
           <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-800 mb-1">Detailed Comparison</h2>
            <p className="text-sm text-slate-500">Analyzing key differences in responsibilities and output.</p>
          </div>
          <ComparisonCard selectedGrades={selectedGrades} />
        </section>
        
        {/* Footer Legend / Info */}
        <div className="mt-12 border-t border-slate-200 pt-8 pb-8 text-center">
          <p className="text-slate-400 text-sm">
            This app was created by <a 
              href="https://salesforce.enterprise.slack.com/team/WJVD6RF96" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              Laurel Knell
            </a>, who is always open to ideas and suggestions!
          </p>
        </div>

      </main>
    </div>
  );
}
