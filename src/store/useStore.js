import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Selected object name/ID
  selectedObject: null,
  
  // Interaction log (last 5 interactions)
  interactionLog: [],
  
  // Set selected object
  setSelectedObject: (objectName) => {
    set({ selectedObject: objectName });
  },
  
  // Add interaction to log
  addInteraction: (interaction) => {
    const { interactionLog } = get();
    const newLog = [interaction, ...interactionLog].slice(0, 5); // Keep last 5
    set({ interactionLog: newLog });
  },
  
  // Reset everything
  reset: () => {
    set({ 
      selectedObject: null, 
      interactionLog: [] 
    });
    // Dispatch reset event for components to listen
    window.dispatchEvent(new CustomEvent('store-reset'));
  },
  
  // Get total interaction count
  getTotalInteractionCount: () => {
    return get().interactionLog.length;
  }
}));

export default useStore;
