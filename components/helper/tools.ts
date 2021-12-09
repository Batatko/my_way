export function dateHandler(taskDate: Date): {
    formatDate: string;
    formatTime: string;
  } {
    const date = taskDate.toString().split(" ");
    const formatDate = `${date[0]}, ${date[1]}, ${date[2]}, ${date[3]}`;
    const formatTime = `${date[4]}`;

    return {
      formatDate,
      formatTime,
    };
}