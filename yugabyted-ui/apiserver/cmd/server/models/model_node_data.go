package models

// NodeData - Node data
type NodeData struct {

	Name string `json:"name"`

	IsNodeUp bool `json:"is_node_up"`

	IsMaster bool `json:"is_master"`

	IsTserver bool `json:"is_tserver"`

	Metrics NodeDataMetrics `json:"metrics"`

	CloudInfo NodeDataCloudInfo `json:"cloud_info"`
}
