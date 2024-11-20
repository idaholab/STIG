import { StixObject } from "@/types/stixTypes/StixObject";
import { JSONStream } from "./jsonStream";

export async function readFiles(files: ArrayLike<File>, type: "text" | "url" = "text") {
  const filePromises = Array.from(files).map(file => {
    const { promise, resolve } = Promise.withResolvers<{name: string; data?: string }>();
    const fileReader = new FileReader();
    if (type === "text") {
      fileReader.readAsText(file);
    } else {
      fileReader.readAsDataURL(file);
    }

    fileReader.onload = event => {
      let fileValue = event.target?.result as string;
      if (type === "url") {
        fileValue = fileValue.split(',')[1]
      }
      resolve({ name: file.name, data: fileValue });
    };
    fileReader.onerror = () => resolve({ name: file.name });

    return promise;
  });
  
  return Promise.all(filePromises);
}

export async function * streamStixFile(file: File): AsyncGenerator<StixObject> {
  const reader = file.stream().getReader();
  const decoder = new TextDecoder();
  const parser = new JSONStream();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return;
    try {
      const chunk = decoder.decode(value);
      for (const { depth, parent, key, value } of parser.parse(chunk)) {
        if (depth !== 2) continue;
        delete parent[key!];
        parent.length = 0;
        yield value as StixObject;
      }
    } catch (e) {
      console.error(e);
      return;
    }
  }
}