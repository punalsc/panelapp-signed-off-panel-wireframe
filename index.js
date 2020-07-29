document.getElementById("items").innerHTML = `<p>Loading...</p>`;

const confidenceLevel = (el) => {
  switch (el) {
    case "0":
      return "Gray";
      break;
    case "1":
      return "Red";
      break;
    case "2":
      return "Amber";
      break;
    case "3":
      return "Green";
      break;
    default:
      return "";
  }
};

fetch(
  "https://panelapp.genomicsengland.co.uk/api/v1/panels/signedoff/79/?format=json"
)
  .then((response) => response.json())
  .then((data) => {
    let result = "";

    if (data.name) {
      result = `    
                <div class='titles'>
                    <div class='row'>
                        <div class='twelve columns'>
                            <h4><b>${data.name} (Version: ${
        data.version
      })</b></h4>
                            <h6><b>Signed off date:</b> ${data.signed_off}</h6>
                            <h6><b>Panel types:</b> ${data.types
                              .map((item) => item.name)
                              .join(", ")}</h6>   
                        </div>
                    </div>
                </div>
                <div class='genes'>
                        <div class='row gene-data'>
                                <div class='one columns'><b>Level</b></div>
                                <div class='one columns'><b>Entity</b></div>
                                <div class='three columns'><b>Mode of inheritance</b></div>
                                <div class='three columns'><b>Mode of pathogenicity</b></div>
                                <div class='three columns'><b>Tags</b></div>
                        </div>
                        ${data.genes
                          .map(
                            (gene) =>
                              `
                              <div class='row gene-data'>
                                <div class='one columns'><span class='confidence-level-badge confidence-level-badge-${confidenceLevel(
                                  gene.confidence_level
                                ).toLowerCase()}'>${confidenceLevel(
                                gene.confidence_level
                              )}</span></div>
                                <div class='one columns'><b>${
                                  gene.entity_name
                                }</b></div>
                                <div class='three columns'>${
                                  gene.mode_of_inheritance === ""
                                    ? "N/A"
                                    : gene.mode_of_inheritance
                                }</div>
                                <div class='three columns'>${
                                  gene.mode_of_pathogenicity === ""
                                    ? "N/A"
                                    : gene.mode_of_pathogenicity
                                }</div>
                            <div class='three columns'>${
                              gene.tags.length === 0
                                ? "N/A"
                                : gene.tags
                                    .map(
                                      (tag) => `<span class='tag'>${tag}</span>`
                                    )
                                    .join(" ")
                            }</div>
                              </div>
                              `
                          )
                          .join("")}
                        
                </div>
                `;
      console.log(data);
    } else {
      result = `<p>No data found</p>`;
    }
    document.getElementById("items").innerHTML = result;
  })
  .catch((err) => console.log(err));
