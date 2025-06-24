// index.ts
import SvgaPlayer from './SvgaPlayer';
import React from 'react';
import {
    requireNativeComponent,
    NativeModules,
    Platform,
    ViewProps
} from 'react-native';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource'

interface SVGAPlayerProps extends ViewProps {
  onFinished?: () => void;
  onFrame?: (value: number) => void;
  onPercentage?: (value: number) => void;
  source: string;
}
interface SVGAPlayerState {
  toFrame: number;
  currentState: string;
  toPercentage: number;
}
export class RNSvgaPlayer extends React.Component<
  SVGAPlayerProps,
  SVGAPlayerState
> {
  private childRef: React.RefObject<RNSvgaPlayer>;

  constructor(props: Readonly<SVGAPlayerProps>) {
    super(props);
    this.state = {} as SVGAPlayerState;
    this.childRef = React.createRef();
  }
  load(source: string) {
    if (this.childRef.current) {
      this.childRef.current?.load(source);
    }
  }
  startAnimation() {
    if (this.childRef.current) {
      this.childRef.current?.startAnimation();
    }
  }
  pauseAnimation() {
    if (this.childRef.current) {
      this.childRef.current?.pauseAnimation();
    }
  }
  stopAnimation() {
    if (this.childRef.current) {
      this.childRef.current?.stopAnimation();
    }
  }
  stepToFrame(toFrame: number, andPlay: boolean) {
    this.setState(
      {
        currentState: andPlay === true ? 'play' : 'pause',
        toFrame: -1,
      },
      () => {
        this.setState({
          toFrame,
        });
      },
    );
  }
  stepToPercentage(toPercentage: number, andPlay: boolean) {
    this.setState(
      {
        currentState: andPlay === true ? 'play' : 'pause',
        toPercentage: -1,
      },
      () => {
        this.setState({
          toPercentage,
        });
      },
    );
  }
  componentWillUnmount() {
    this.stopAnimation();
  }
  render() {
    if (!this.props.source) {
      return null;
    }

    return <SvgaPlayer ref={this.childRef} {...this.props} {...this.state} />;
  }
}


const _Module = NativeModules.SvgaMoudle || NativeModules.RNSVGAManager
export class RNSVGAModule {

    // 动态获取本地资源
    static getAssets(nodeRequire) {
        return resolveAssetSource(nodeRequire).uri
    }

    // 判断是否有缓存
    static isCached(url) {
        if (Platform.OS == 'android') {
            return _Module.isCached(url)
        } else {
            return Promise.resolve(true)
        }
    }

    // 预加载
    static advanceDownload(urls) {
        _Module.advanceDownload(urls)
    }
}