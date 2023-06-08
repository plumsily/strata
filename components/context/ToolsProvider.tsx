import {
  createContext,
  useState,
  useContext,
  ReactNode,
  PropsWithChildren,
  Dispatch,
} from "react";

interface IToolsContext {
  tool: string;
  setTool: Dispatch<React.SetStateAction<string>>;
  colorHex: string;
  setColorHex: Dispatch<React.SetStateAction<string>>;
  colorHistory: string[];
  setColorHistory: Dispatch<React.SetStateAction<string[]>>;
  width: number;
  setWidth: Dispatch<React.SetStateAction<number>>;
}

// Create the context with default values (they will be overridden by Provider)
export const ToolsContext = createContext<IToolsContext>({
  tool: "pencil",
  setTool: () => {},
  colorHex: "#000000",
  setColorHex: () => {},
  colorHistory: [],
  setColorHistory: () => {},
  width: 1,
  setWidth: () => {},
});

export const useToolsContext = () => useContext(ToolsContext);

export const ToolsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [tool, setTool] = useState<string>("pencil");
  const [colorHex, setColorHex] = useState<string>("#000000");
  const [colorHistory, setColorHistory] = useState<string[]>(["#000000"]);
  const [width, setWidth] = useState(1);

  return (
    <ToolsContext.Provider
      value={{
        tool,
        setTool,
        colorHex,
        setColorHex,
        colorHistory,
        setColorHistory,
        width,
        setWidth,
      }}
    >
      {children}
    </ToolsContext.Provider>
  );
};
