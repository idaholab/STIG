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