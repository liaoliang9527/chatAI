//时间格式化
export const formatTime = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

function formatNumber(value: number): unknown {
  if (value < 10) {
    return "0" + value;
  }
  return value;
}

// png, jpg, jpeg, webp, gif
export const imageType = ["png", "jpg", "jpeg", "webp", "gif"];

//计算图像大小转换为KB
export const getImageSize = (size: number) => {
  return (size / 1024).toFixed(2) + "KB";
};
