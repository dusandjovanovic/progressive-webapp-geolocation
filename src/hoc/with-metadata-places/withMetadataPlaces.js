import React from "react";

const withMetadataPlaces = WrappedComponent => {
	class withMetadataPlaces extends React.Component {
		render() {
			return <WrappedComponent {...this.props} />;
		}
	}

	return withMetadataPlaces;
};

export default withMetadataPlaces;
