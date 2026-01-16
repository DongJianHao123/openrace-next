// src/utils/dataOptimize.ts
import { compressToBase64, decompressFromBase64 } from 'lz-string';

/**
 * 通用：根据白名单精简对象字段（支持嵌套）
 * @param data 原始数据（对象/数组）
 * @param whitelist 字段白名单（支持嵌套，如 'user.name'）
 * @returns 精简后的数据
 */
export const pickWhitelistFields = (data: any, whitelist: string[]): any => {
  if (Array.isArray(data)) {
    return data.map((item) => pickWhitelistFields(item, whitelist));
  }
  if (typeof data !== 'object' || data === null) return data;

  const result: any = {};

  whitelist.forEach((path) => {
    const parts = path.split('.');
    let currentSrc = data;
    let currentDest = result;

    for (let i = 0; i < parts.length; i++) {
      const key = parts[i];
      if (!(key in currentSrc)) break;

      if (i === parts.length - 1) {
        // 到达路径末尾，如果是对象，建议只取基本值或进一步递归
        // 这里简单处理：直接赋值。如果需要更细，需配合更详细的白名单
        currentDest[key] = currentSrc[key];
      } else {
        // 中间路径，创建空对象并继续
        currentDest[key] = currentDest[key] || {};
        currentSrc = currentSrc[key];
        currentDest = currentDest[key];
        // 如果中间路径是数组，此简单逻辑需升级支持数组路径（如 'list.0.name'）
      }
    }
  });

  return JSON.parse(JSON.stringify(result));
};

/**
 * 通用：压缩数据（服务端使用）
 * @param data 原始数据
 * @returns 压缩后的 Base64 字符串
 */
export const compressData = <T>(data: T): string => {
  try {
    const jsonStr = JSON.stringify(data);
    return compressToBase64(jsonStr);
  } catch (error) {
    console.error('数据压缩失败：', error);
    return '';
  }
};

/**
 * 通用：解压缩数据（客户端使用）
 * @param compressedData 压缩后的 Base64 字符串
 * @returns 原始数据
 */
export const decompressData = <T>(compressedData: string, defaultValue: T): T => {
  try {``
    const jsonStr = decompressFromBase64(compressedData);
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error('数据解压缩失败：', error);
    // ✅ 传入默认值，避免返回 undefined
    return defaultValue;
  }
};


/**
 * 通用：批量精简 + 压缩数据（适用于多接口场景）
 * @param rawData 原始数据对象（如 { challenges: [], collections: [] }）
 * @param whitelistMap 各字段的白名单映射（如 { challenges: ['id', 'title'], collections: ['name'] }）
 * @returns 压缩后的精简数据
 */
// 同时优化批量压缩函数（可选）
export const optimizeAndCompress = <T>(
  rawData: T,
  whitelistMap: Record<keyof T, string[]>
): Record<keyof T, string> => {
  const result: Record<keyof T, string> = {} as Record<keyof T, string>;
  
  Object.keys(rawData as Record<string, any>).forEach(key => {
    const fieldKey = key as keyof T;
    const simplifiedData = pickWhitelistFields(rawData[fieldKey], whitelistMap[fieldKey]);
    result[fieldKey] = compressData(simplifiedData);
  });  
  return result;
};