import ContentLoader, { Rect, Circle, Path } from 'react-content-loader/native';

export default function BannerListSkeleton() {
  function MyLoader(props) {
    return (
      <ContentLoader
        speed={2}
        width={400}
        height={217}
        viewBox="0 0 400 200"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        {/* <Circle cx="31" cy="31" r="15" />  */}
        {/* <Rect x="58" y="18" rx="2" ry="2" width="140" height="10" />  */}
        <Rect x="0" y="6" rx="2" ry="2" width="175" height="20" />
        <Rect x="0" y="36" rx="2" ry="2" width="325" height="175" />
        <Rect x="337" y="36" rx="2" ry="2" width="325" height="175" />
      </ContentLoader>
    );
  }

  return <MyLoader />;
}
