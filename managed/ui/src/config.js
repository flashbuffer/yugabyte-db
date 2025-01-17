// Copyright (c) YugaByte, Inc.
import _ from 'lodash';
import Cookies from 'js-cookie';

export const IN_DEVELOPMENT_MODE = process.env.NODE_ENV === 'development';

// NOTE: when using REACT_APP_YUGAWARE_API_URL at local development - after login with SSO it will
// set auth cookies for API host domain and redirect to API host root instead of localhost:3000/
// Need to manually set "userId", "customerId" and "PLAY_SESSION" cookies for localhost:3000
export const ROOT_URL =
  process.env.REACT_APP_YUGAWARE_API_URL ||
  (IN_DEVELOPMENT_MODE ? 'http://localhost:9000/api/v1' : '/api/v1');

export const MAP_SERVER_URL = IN_DEVELOPMENT_MODE
  ? `https://s3-us-west-2.amazonaws.com/${process.env.REACT_APP_YB_MAP_URL}/map`
  : '/static/map';

// get SSO flag from global config loaded in index.html before UI app started
export const USE_SSO = _.get(window, 'YB_Platform_Config.use_oauth', false);

export const isSSOLogin = () => Cookies.get('apiToken') || localStorage.getItem('apiToken');

export const isSSOEnabled = () => _.get(window, 'YB_Platform_Config.use_oauth', false);

export const setSSO = (value) => _.set(window, 'YB_Platform_Config.use_oauth', value);

// TODO : probably fetch the provider metadata (name and code from backend)
export const PROVIDER_TYPES = [
  { code: 'aws', name: 'Amazon', label: 'Amazon Web Services' },
  { code: 'docker', name: 'Docker Localhost', label: 'Docker' },
  { code: 'azu', name: 'Azure', label: 'Microsoft Azure' },
  { code: 'gcp', name: 'Google', label: 'Google Cloud' },
  { code: 'onprem', name: 'On Premises', label: 'On-Premises Datacenter' },
  { code: 'kubernetes', name: 'Kubernetes', label: 'Kubernetes' },
  { code: 'cloud-1', name: 'Cloud-1', label: 'Cloud-1' },
  { code: 'other', name: 'Other', label: 'Custom Datacenter' }
];

export const REGION_METADATA = [
  { code: 'us-west', name: 'US West', latitude: 37, longitude: -121 },
  { code: 'us-east', name: 'US East', latitude: 36.8, longitude: -79 },
  { code: 'us-south', name: 'US South', latitude: 28, longitude: -99 },
  { code: 'us-north', name: 'US North', latitude: 48, longitude: -118 },
  { code: 'south-asia', name: 'South Asia', latitude: 18.4, longitude: 78.4 },
  { code: 'south-east-asia', name: 'SE Asia', latitude: 14, longitude: 101 },
  { code: 'new-zealand', name: 'New Zealand', latitude: -43, longitude: 171 },
  { code: 'japan', name: 'Japan', latitude: 36, longitude: 139 },
  { code: 'eu-west', name: 'EU West', latitude: 48, longitude: 3 },
  { code: 'eu-east', name: 'EU East', latitude: 46, longitude: 25 },
  { code: 'china', name: 'China', latitude: 31.2, longitude: 121.5 },
  { code: 'brazil', name: 'Brazil', latitude: -22, longitude: -43 },
  { code: 'australia', name: 'Australia', latitude: -29, longitude: 148 }
];

export const REGION_DICT = {};
REGION_METADATA.forEach((region, index) => {
  REGION_DICT[region.code] = {
    ...region,
    index // Track position in array for ease of access
  };
});

export const KUBERNETES_PROVIDERS = [
  // keep deprecated PKS to properly show existing PKS providers in the list, if any
  { code: 'pks', name: 'Pivotal Container Service' },
  { code: 'tanzu', name: 'VMware Tanzu' },
  { code: 'openshift', name: 'Red Hat OpenShift' },
  { code: 'gke', name: 'Google Kubernetes Engine' },
  { code: 'aks', name: 'Azure Kubernetes Service' },
  { code: 'eks', name: 'Elastic Kubernetes Service' },
  { code: 'custom', name: 'Custom Kubernetes Service' }
];

//TODO : Move this to translation json
export const YUGABYTE_TITLE = 'YugabyteDB Anywhere';
