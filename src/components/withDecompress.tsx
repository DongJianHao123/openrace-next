import { ComponentType, ReactNode } from "react";
import { decompressData } from "@/utils/dataOptimize";

/**
 * 通用解压缩高阶组件
 * @param WrappedComponent 需要接收原始数据的子组件
 * @param decompressMap 压缩字段与原始字段的映射（如 { compressedChallenges: 'challenges' }）
 * @returns 封装后的组件，自动解压缩并传递原始格式的 props
 */
export function withDecompress<Props>(
  WrappedComponent: ComponentType<Props>,
  decompressMap: Record<string, keyof Props>
) {    
  // 定义封装组件的 props 类型（接收压缩后的字段）
  type CompressedProps = {
    [K in keyof typeof decompressMap]: string;
  } & Omit<Props, ValueOf<typeof decompressMap>>;

  // 核心：封装组件，自动解压缩并传递原始 props
  const DecompressWrapper = (props: CompressedProps) => {
    // 1. 解压缩数据：根据映射关系，将压缩字段转为原始字段
    const decompressedProps: Record<string, any> = {};
    Object.entries(decompressMap).forEach(([compressedKey, originalKey]) => {
      const compressedValue = props[compressedKey as keyof CompressedProps] as string;
      // 同步解压缩（SEO 友好），默认值为空数组
      decompressedProps[originalKey as string] = decompressData(compressedValue, []);
    });

    // 2. 合并其他 props（非压缩字段）
    const otherProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !Object.keys(decompressMap).includes(key))
    );   

    // 3. 传递原始格式的 props 给子组件
    return <WrappedComponent {...otherProps as Omit<Props, keyof typeof decompressMap>} {...decompressedProps as Props} />;
  };

  // 保留组件名称，方便调试
  DecompressWrapper.displayName = `withDecompress(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return DecompressWrapper;
}

// 辅助类型：获取对象值的类型
type ValueOf<T> = T[keyof T];