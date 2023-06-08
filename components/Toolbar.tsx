import {
  ChangeEvent,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import * as fabric from "fabric";
import {
  Slider,
  InputNumber,
  ColorPicker,
  Radio,
  RadioChangeEvent,
} from "antd";
import { Color } from "antd/es/color-picker";
import { COLORS } from "@/lib/constants";
import { useToolsContext, ToolsContext } from "./context/ToolsProvider";

interface ToolbarProps {
  canvas: fabric.Canvas | null;
}

function Toolbar({ canvas }: ToolbarProps) {
  //   const [colorHex, setColorHex] = useState<string>("#000000");
  //   const [colorHistory, setColorHistory] = useState<string[]>(["#000000"]);
  //   const [width, setWidth] = useState(1);
  const {
    setTool,
    colorHex,
    setColorHex,
    colorHistory,
    setColorHistory,
    width,
    setWidth,
  } = useContext(ToolsContext);
  const [isErasing, setIsErasing] = useState(false);

  function handleChangeColor(value: Color, hex: string): void {
    setColorHex(hex);
    setColorHistory((color) => {
      return [hex, ...color];
    });
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = hex;
      setIsErasing(false);
    }
  }

  function handleChangeWidth(newValue: number | null): void {
    if (newValue) {
      setWidth(newValue);
      if (canvas && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = newValue;
      }
    }
  }

  function handleEraser(): void {
    if (canvas && canvas.freeDrawingBrush) {
      if (isErasing) {
        canvas.freeDrawingBrush.color = colorHex;
      } else {
        canvas.freeDrawingBrush.color = "#FFFFFF";
      }
    }
    setIsErasing(!isErasing);
  }

  const handleToolChange = (e: RadioChangeEvent) => {
    const newTool = e.target.value;

    if (canvas) {
      if (newTool === "pencil" || newTool === "eraser") {
        canvas.isDrawingMode = true;
        canvas.selection = false;
        canvas.forEachObject(function (object) {
          object.set("selectable", false);
        });
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color =
          newTool === "pencil" ? colorHex : "#FFFFFF"; // Assuming the canvas background is white
        canvas.freeDrawingBrush.width = width;
      } else if (newTool === "move") {
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.forEachObject(function (object) {
          object.set("selectable", true);
        });
      } else {
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.forEachObject(function (object) {
          object.set("selectable", false);
        });
      }
      canvas.renderAll();
    }

    setTool(newTool);
  };

  return (
    <div className="fixed top-0 left-0 p-1 flex justify-between bg-white/50 backdrop-blur-md border-b border-gray-300 w-full z-10">
      {/* <label>
        Color:
        <input type="text" value={color} onChange={handleChangeColor} />
      </label> */}
      <ColorPicker
        format={"hex"}
        defaultValue={"#000000"}
        value={colorHex}
        onChange={handleChangeColor}
        presets={[
          {
            label: "Recommended",
            colors: COLORS,
          },
          {
            label: "Recent",
            colors: colorHistory,
          },
        ]}
      />
      <div className="flex items-center gap-2">
        <Slider
          min={1}
          max={50}
          value={typeof width === "number" ? width : 0}
          onChange={handleChangeWidth}
          tooltip={{ open: false }}
          className="w-20"
        />
        <InputNumber
          min={1}
          max={50}
          value={width}
          onChange={handleChangeWidth}
          className="w-16"
        />
      </div>
      <Radio.Group
        defaultValue="pencil"
        buttonStyle="solid"
        onChange={handleToolChange}
      >
        <Radio.Button value="move">Move</Radio.Button>
        <Radio.Button value="pencil">Brush</Radio.Button>
        <Radio.Button value="eraser">Eraser</Radio.Button>
        <Radio.Button value="line">Line</Radio.Button>
        <Radio.Button value="rectangle">Rectangle</Radio.Button>
      </Radio.Group>
      {/* 
      <button onClick={handleEraser}>
        {isErasing ? "Switch to Brush" : "Switch to Eraser"}
      </button> */}
    </div>
  );
}

export default Toolbar;
