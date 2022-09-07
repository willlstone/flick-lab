import ContentLoader, { Rect } from 'react-content-loader/native';

export default function HorizontalListSkeleton() {
  function MyLoader(props) {
    return (
      <ContentLoader
        speed={2}
        width={400}
        height={251}
        viewBox="0 0 400 200"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <Rect x="0" y="6" rx="2" ry="2" width="100" height="20" />
        <Rect x="275" y="6" rx="2" ry="2" width="75" height="20" />
        <Rect x="0" y="36" rx="2" ry="2" width="150" height="225" />
        <Rect x="162" y="36" rx="2" ry="2" width="150" height="225" />
        <Rect x="324" y="36" rx="2" ry="2" width="150" height="225" />
      </ContentLoader>
    );
  }

  return <MyLoader />;
}
