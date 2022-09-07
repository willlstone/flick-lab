import ContentLoader, { Rect } from 'react-content-loader/native';

export default function HorizontalGridSkeleton() {
  function MyLoader(props) {
    return (
      <ContentLoader
        speed={2}
        width={400}
        height={356}
        viewBox="0 0 400 356"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <Rect x="0" y="6" rx="2" ry="2" width="100" height="20" />
        <Rect x="275" y="6" rx="2" ry="2" width="75" height="20" />
        <Rect x="0" y="36" rx="2" ry="2" width="100" height="150" />
        <Rect x="110" y="36" rx="2" ry="2" width="100" height="150" />
        <Rect x="220" y="36" rx="2" ry="2" width="100" height="150" />
        <Rect x="330" y="36" rx="2" ry="2" width="100" height="150" />
        <Rect x="0" y="196" rx="2" ry="2" width="100" height="150" />
        <Rect x="110" y="196" rx="2" ry="2" width="100" height="150" />
        <Rect x="220" y="196" rx="2" ry="2" width="100" height="150" />
        <Rect x="330" y="196" rx="2" ry="2" width="100" height="150" />
      </ContentLoader>
    );
  }

  return <MyLoader />;
}
