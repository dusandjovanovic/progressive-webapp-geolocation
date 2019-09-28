import React from "react";

const withMetadataTraffic = WrappedComponent => {
	class withMetadataTraffic extends React.Component {
		render() {
			return <WrappedComponent {...this.props} />;
		}
	}

	return withMetadataTraffic;
};

export default withMetadataTraffic;
