import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { importOutlook } from "./utils/import";
import { useStore } from "./stores/contacts";

export function ImportLink() {
  const saveMany = useStore((s) => s.saveMany);
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
    noClick: true,
    noDrag: true,
    noKeyboard: true,
    onDrop([file]) {
      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
        complete(results) {
          saveMany(importOutlook(results.data));
        },
      });
    },
  });
  return (
    <>
      <button type="button" onClick={open}>
        import
      </button>
      <div {...getRootProps({ style: { display: "none" } })}>
        <input {...getInputProps()} />
      </div>
    </>
  );
}
