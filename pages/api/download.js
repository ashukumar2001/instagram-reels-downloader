import cheerio from "cheerio";
import fetch from "node-fetch";
const download = async (req, res) => {
  const getVideo = async (url) => {
    const html = await scrapeHtmlFromUrl(url);
    const json = await getJsonFromHtml(html);
    let urls = [];
    if (json) {
      urls = await getUrlFromJson(json);
    } else {
      urls = await getUrlFromHtml(html);
    }

    return urls;
  };

  const urlChecker = (url) => {
    const reg = new RegExp(
      "(https://www.instagram.com/(?:p|reel|tv)/[a-zA-Z0-9_-]{11}/)"
    );
    const match = url.match(reg);
    return match;
  };

  const scrapeHtmlFromUrl = async (url) => {
    const matching = await urlChecker(url);
    if (!matching) {
      return;
    }
    const urlApi = `${matching[0]}embed/`;
    const res = await fetch(urlApi);
    const html = await res.text();

    return html;
  };

  const getJsonFromHtml = async (html) => {
    var json = null;
    const $ = cheerio.load(html);
    $("script").each((i, el) => {
      const script = $(el).html();
      const reg = new RegExp("window\\.__additionalDataLoaded\\((.*)\\)");
      const match = script.match(reg);
      if (match) {
        const res = match[1].replace("'extra',", "");
        json = JSON.parse(res);
      }
    });
    return json;
  };

  const getUrlFromHtml = async (html) => {
    const $ = cheerio.load(html);
    const url = $(".EmbeddedMediaImage").attr("src");
    return [url];
  };

  const getUrlFromJson = async (json) => {
    const data = json.shortcode_media;
    const isSingle = data.edge_sidecar_to_children ? false : true;

    if (isSingle) {
      if (data.is_video) {
        return [data.video_url];
      } else {
        return [data.display_url];
      }
    } else {
      const urls = [];
      data.edge_sidecar_to_children.edges.forEach((edge) => {
        if (edge.node.is_video) {
          urls.push(edge.node.video_url);
        } else {
          urls.push(edge.node.display_url);
        }
      });
      return urls;
    }
  };

  const { url } = req.body;
  if (!url) {
    return res.status(400).send("Please enter url!");
  }
  try {
    const downloadLink = await getVideo(url);
    if (downloadLink !== undefined) {
      res.send({ status: true, downloadLink });
    } else {
      res.status(400).send({
        status: false,
        message: "The link you have enetered is invalid!",
      });
    }
  } catch (error) {
    res
      .status(404)
      .send({ status: false, message: "Unable to find data for given link!" });
  }
};

export default download;
