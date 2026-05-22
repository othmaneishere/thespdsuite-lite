import { cn } from '../lib/utils';
import { PESTELData, McKinsey7SData, VRIOAnalysisData, TOWSMatrixData, PortersFiveForcesData } from '../types';

export const PESTELWorksheet = ({ data, setData }: { data: PESTELData[]; setData: (d: PESTELData[]) => void }) => {
  const categories = ['Political', 'Economic', 'Social', 'Technological', 'Environmental', 'Legal'] as const;
  const updateItem = (id: string, field: keyof PESTELData, value: string) => {
    setData(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border-b-2 border-l-2 border-r-2 border-black">
        <thead>
          <tr className="bg-brand-blue text-black">
            <th className="w-32 border border-black p-4 bg-white"></th>
            <th className="border border-black p-4 text-center font-bold text-lg min-w-[400px]">Description</th>
            <th className="w-24 border border-black p-4 text-center font-bold text-sm">Impact</th>
            <th className="w-24 border border-black p-4 text-center font-bold text-sm">Probability</th>
            <th className="w-48 border border-black p-4 text-center font-bold text-sm leading-tight">Potential</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => {
            const item = data.find(d => d.category === cat) || { id: cat, category: cat, description: '', impact: '', probability: '', potential: '' };
            return (
              <tr key={cat} className="group">
                <td className="border border-black p-4 font-bold text-center bg-gray-50 align-middle">{cat}</td>
                <td className="border border-black p-0"><textarea value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="w-full h-full min-h-[140px] p-4 bg-transparent outline-none resize-none" /></td>
                <td className="border border-black p-0"><textarea value={item.impact} onChange={(e) => updateItem(item.id, 'impact', e.target.value)} className="w-full h-full min-h-[120px] p-2 text-center outline-none bg-transparent" /></td>
                <td className="border border-black p-0"><textarea value={item.probability} onChange={(e) => updateItem(item.id, 'probability', e.target.value)} className="w-full h-full min-h-[120px] p-2 text-center outline-none bg-transparent" /></td>
                <td className="border border-black p-0"><textarea value={item.potential} onChange={(e) => updateItem(item.id, 'potential', e.target.value)} className="w-full h-full min-h-[120px] p-2 text-center outline-none bg-transparent" /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const McKinseyWorksheet = ({ data, setData }: { data: McKinsey7SData; setData: (d: McKinsey7SData) => void }) => {
  const elements = [
    { key: 'sharedValues', label: 'Shared Values' },
    { key: 'strategy', label: 'Strategy' },
    { key: 'structure', label: 'Structure' },
    { key: 'systems', label: 'Systems' },
    { key: 'style', label: 'Style' },
    { key: 'staff', label: 'Staff' },
    { key: 'skills', label: 'Skills' }
  ] as const;

  const updateGrid = (rowKey: string, colKey: string, value: string) => {
    setData({ ...data, [rowKey]: { ...(data[rowKey] || {}), [colKey]: value } });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border-b-2 border-l-2 border-r-2 border-black table-fixed">
        <thead>
          <tr className="bg-brand-peach">
            <th className="w-40 border border-black p-4 bg-white"></th>
            {elements.map(el => <th key={el.key} className="border border-black p-4 text-center font-bold text-[10px] uppercase">{el.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {elements.map((rowEl, rowIndex) => (
            <tr key={rowEl.key}>
              <td className="border border-black p-4 font-bold text-center bg-gray-50 text-[10px] uppercase align-middle h-20">{rowEl.label}</td>
              {elements.map((colEl, colIndex) => (
                <td key={colEl.key} className={cn("border border-black p-0 relative h-20", rowIndex === colIndex && "bg-brand-peach")}>
                  <textarea value={data[rowEl.key]?.[colEl.key] || ''} onChange={(e) => updateGrid(rowEl.key, colEl.key, e.target.value)} className="w-full h-full p-2 bg-transparent outline-none resize-none text-[10px]" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const VRIOAnalysisTable = ({ data, setData }: { data: VRIOAnalysisData[]; setData: (d: VRIOAnalysisData[]) => void }) => {
    const updateItem = (id: string, field: keyof VRIOAnalysisData, value: string) => {
        setData(data.map(item => item.id === id ? { ...item, [field]: value } : item));
    };
    return (
        <table className="w-full border-collapse border-2 border-black">
          <thead>
            <tr className="bg-white">
              <th className="border border-black p-4">Resource</th>
              <th className="border border-black p-4">Type</th>
              <th className="border border-black p-4">Detail</th>
              <th className="border border-black p-2">V</th>
              <th className="border border-black p-2">R</th>
              <th className="border border-black p-2">I</th>
              <th className="border border-black p-2">O</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="border border-black"><input value={item.resource} onChange={(e) => updateItem(item.id, 'resource', e.target.value)} className="w-full p-2" /></td>
                <td className="border border-black"><input value={item.type} onChange={(e) => updateItem(item.id, 'type', e.target.value)} className="w-full p-2" /></td>
                <td className="border border-black"><input value={item.detail} onChange={(e) => updateItem(item.id, 'detail', e.target.value)} className="w-full p-2" /></td>
                <td className="border border-black"><input value={item.v} onChange={(e) => updateItem(item.id, 'v', e.target.value)} className="w-full p-2 text-center" /></td>
                <td className="border border-black"><input value={item.r} onChange={(e) => updateItem(item.id, 'r', e.target.value)} className="w-full p-2 text-center" /></td>
                <td className="border border-black"><input value={item.i} onChange={(e) => updateItem(item.id, 'i', e.target.value)} className="w-full p-2 text-center" /></td>
                <td className="border border-black"><input value={item.o} onChange={(e) => updateItem(item.id, 'o', e.target.value)} className="w-full p-2 text-center" /></td>
              </tr>
            ))}
          </tbody>
        </table>
    );
};
