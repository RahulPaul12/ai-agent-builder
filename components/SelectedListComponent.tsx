interface Item {
  id: string;
  name: string;
}

interface SelectedItemListProps {
  title: string;
  selectedIds: string[];
  allData: Item[] | undefined;
  onRemove: (id: string) => void;
}
export default function SelectedListComponent ({ title, selectedIds, allData, onRemove }: SelectedItemListProps){
    return (
        <>
        <h3>Selected {title}</h3>
        {selectedIds.length > 0 && allData ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {selectedIds.map(id => {
              const item = allData.find(i => i.id === id);
              return (
                <li key={id} style={{ marginBottom: '0.5rem' }} className="glass w-fit! px-2 py-1">
                  {item?.name || 'Unknown Item'}
                  <button className="text-red-500" onClick={() => onRemove(id)} style={{ marginLeft: '1rem', fontSize: '0.8rem', cursor: 'pointer' }} > X </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p style={{ color: '#888' }}>No {title.toLowerCase()} added.</p>
        )}
    </>
    )
}