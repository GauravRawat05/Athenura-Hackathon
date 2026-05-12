import {
  createHackathon as createHackathonService,
  updateHackathon as updateHackathonService,
  deleteHackathon as deleteHackathonService,
  findHackathonById, updateHackathonRuleService
} from './adminHackathon.service.js';

export const createHackathon = async (req, res) => {
  try {
    const hackathon = await createHackathonService(req.body);
    res.status(201).json(hackathon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateHackathon = async (req, res) => {
  const { hackathonId } = req.params;
  try {
    const hackathon = await updateHackathonService(hackathonId, req.body);
    res.json(hackathon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const updateHackathonsRules = async (req, res) => {
  const { hackathonId } = req.params;
  try {
    const hackathon = await updateHackathonRuleService(hackathonId, req.body);
    res.json(hackathon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const deleteHackathon = async (req, res) => {
  const { hackathonId } = req.params;
  try {
    await deleteHackathonService(hackathonId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getHackathon = async (req, res) => {
  const { hackathonId } = req.params;
  try {
    const hackathon = await findHackathonById(hackathonId);
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });
    res.json(hackathon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
